import { Dimensions, Platform, ScaledSize } from "react-native";
import RNFS from "react-native-fs";
import { decode } from "html-entities";
import { TimeMeetingModel } from "~/models/meeting";
import { StorageMediaAttachemt } from "~/models/media";
import moment from "moment";
import { EmoijType, TotalReaction } from "~/constants/Emoijs";
import _ from "lodash";
import { EmojiModel } from "~/constants/Emoijs";
import { Reaction } from "~/models/reaction";
import { ShortProfileUserModel } from "~/models/user";
import { MyMarkedDate, MyMarkingProps, ScheduleModel } from "~/models/schedule";
import { BASE_URL } from "@env";

const MOV_REG = RegExp(/(.*).mov/i);
export default class Helper {
  static getImageUrl(key?: string) {
    if (!key) {
      return "";
    }

    if (key.startsWith("https")) {
      return key;
    }

    const searchParams = new URLSearchParams();
    searchParams.append("key", key);
    return `${BASE_URL}/api/files?${searchParams.toString()}`;
  }

  static getBoolean(src: string): boolean {
    return src.toLocaleLowerCase() === "true" ? true : false;
  }

  static responseSizeWidth(
    pixel = 0,
    config?: {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      dimensions?: ScaledSize;
      yan;
    },
  ) {
    const widthDesign = 375;

    const { width } = config?.dimensions ?? Dimensions.get("window");

    const result = (pixel / widthDesign) * width;

    const _min = Math.max(config?.minWidth ?? result, result);

    if (config?.maxWidth) {
      Math.min(config?.maxWidth, _min);
    }
    return _min;
  }

  static urlify = (text: string) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return `<a href="${url}">${url}</a>`;
    });
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  };

  static decodeHTML = (raw: string): string => {
    if (!raw) {
      return raw;
    }
    const input = this.urlify(raw);
    // const input = raw;

    let result = input
      .replace(/^.*&lt;body&gt;(.*?)&lt;\/body&gt;.*$/g, "$1")
      .replace(/\*BR\*(.*?)<\*\/BR\*>/g, "<br>$1</br>")
      .replace(/\*B\*(.*?)\*\/B\*/g, "<b>$1</b>")
      .replace(/\*BR\**\/BR\*/g, "<br/>")
      /**Bị dư sau khi dùng api translate */
      .replace(/\*+\/BR\*+/g, "<br/>")
      .replace(/\*U\*(.*?)\*\/U\*/g, "<u>$1</u>")
      .replace(/\*I\*(.*?)\*\/I\*/g, "<u>$1</u>")
      .replace(
        /(\*URL\*(.*?)\[(.*?)\]\((.*?)\)\*\/URL\*)/g,
        (_, __, p1, p2, p3) => {
          const link = `<a href=${p3} style="text-decoration: none; color: red">${p2}</a>`;
          if (p1) {
            return `${p1} ${link}`;
          }

          return `<a href=${p3} style="text-decoration: none; color: red">${p2}</a>`;
        },
      );
    result = decode(result);
    result = this.formatHTMLTag(result);
    return result;
  };

  static formatHTMLTag = (htmlInput: string) => {
    return htmlInput
      .replace(/<body>((.|\n)*?)<\/body>/g, "$1")
      .replace(/<p(.*?)>((.|\n)*?)<\/p>/g, "$2")
      .replace(/<p>((.|\n)*?)<\/p>/g, "$1")
      .replace(/<span(.*?)>((.|\n)*?)<\/span>/g, "$2")
      .replace(/<span>((.|\n)*?)<\/span>/g, "$1")
      .replace(/< br \/>| < br \/ >/g, "")
      .replace(/<p>((.|\n)*?)<\/p>/g, "$1")
      .replace(/<img (.*?)\/>/g, "")
      .replace(/\n/, "");
  };

  static trimHTMLContent = (htmlInput: string) => {
    // Clear on start and end of html
    // <div><br></div>
    // <div>    </div>
    // <div>&nbsp;</div>
    return htmlInput
      .replace(/(<.*>(\s+|<br>+|((&nbsp;)\s?)+?)<\/.*>)+$/g, "")
      .replace(/^(<.*>(\s+|<br>+|((&nbsp;)\s?)+?)<\/.*>)+/g, "");
  };

  static extractTextOnlyFromHTML = (htmlInput?: string): string => {
    // Remove all html tag
    return htmlInput?.replace(/<[^>]*>/gim, "").replace(/&nbsp;/gim, " ") ?? "";
  };

  // TIME HELPER
  static formatTimeNumber = (value: number): string => {
    return value > 9 ? `${value}` : `0${value}`;
  };

  static formatDate = (
    src: string,
    type: "date" | "datetime" | "time" = "date",
  ): string => {
    if (!src) {
      return "N/A";
    }
    const date = new Date(src);

    const hh = this.formatTimeNumber(date.getHours());
    const mm = this.formatTimeNumber(date.getMinutes());

    const dd = this.formatTimeNumber(date.getDate());
    const MM = this.formatTimeNumber(date.getMonth() + 1);
    const yyyy = this.formatTimeNumber(date.getFullYear());

    switch (type) {
      case "time":
        return `${hh}:${mm}`;
      case "date":
        return `${dd}/${MM}/${yyyy}`;
      case "datetime":
        return `${hh}:${mm}, ${dd}/${MM}/${yyyy}`;
      default:
        return `${hh}:${mm} - ${dd}/${MM}/${yyyy}`;
    }
  };

  static createDateTime = (src: string): string => {
    // hh:mm - dd/mm/yyyy
    const datetimes = src.split(" - ");
    if (datetimes.length < 2) {
      return new Date().toISOString();
    }
    const times = datetimes[0].split(":");
    if (times.length < 2) {
      return "";
    }
    const hh = parseInt(times[0], 10);
    const mm = parseInt(times[1], 10);
    const date = datetimes[1].split("/");
    if (date.length < 3) {
      return new Date().toISOString();
    }

    const day = parseInt(date[0], 10);
    const month = parseInt(date[1], 10);
    const year = parseInt(date[2], 0);

    const newDate = new Date(year, month - 1, day, hh, mm);
    return newDate.toISOString();
  };

  static createDate = (src: string): string => {
    const data = src.split("/");
    if (data.length < 3) {
      return "";
    }
    const day = parseInt(data[0], 10);
    const month = parseInt(data[1], 10);
    const year = parseInt(data[2], 0);

    const date = new Date(year, month - 1, day);
    return date.toISOString();
  };

  static getMomentTime = (src: string): string => {
    if (!src) {
      return "";
    }
    const date = new Date(src);
    const current = new Date();

    if (
      date.getFullYear() === current.getFullYear() &&
      date.getMonth() === current.getMonth()
    ) {
      const interval = date.getDate() - current.getDate();
      switch (interval) {
        case -1:
          return "hôm qua";
        case 0:
          return "hôm nay";
        case 1:
          return "ngày mai";
        default:
          `ngày ${this.formatDate(src)}`;
          break;
      }
    }
    return `ngày ${this.formatDate(src)}`;
  };

  static getTime = (src: string): string => {
    const date = new Date(src);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const hh = hours > 9 ? `${hours}` : `0${hours}`;
    const mm = minutes > 9 ? `${minutes}` : `0${minutes}`;

    return `${hh}:${mm} ${this.getMomentTime(src)}`;
  };

  static getTimeMeeting(start: string, end: string): TimeMeetingModel {
    const time: TimeMeetingModel = {
      from: this.formatDate(start, "time"),
      to: this.formatDate(end, "time"),
      date: this.formatDate(start, "date"),
      display: `${this.formatDate(start, "time")} - ${this.getTime(end)}`,
    };

    return time;
  }

  static calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    let time = parseInt(`${(end.getTime() - start.getTime()) / 1000}`); //second unit
    /**
     * 1 day = 24h = 24*60*60s = 86400s
     * 1h = 60m = 60*60s = 3600s
     * 1m = 60s = 60s
     * 1s = 1000ms
     */
    const days = Math.floor(time / 86400);
    time = time % 86400;
    const hours = Math.floor(time / 3600);
    time = time % 3600;
    const minutes = Math.floor(time / 60);

    const dd = days === 0 ? "" : `${this.formatTimeNumber(days)} ngày`;
    const hh = hours === 0 ? "" : `${this.formatTimeNumber(hours)} giờ`;
    const mm = minutes === 0 ? "" : `${this.formatTimeNumber(minutes)} phút`;

    return `${dd} ${hh} ${mm}`;
  };

  static isValidMeetingTime = (fromTxt: string, toTxt: string) => {
    const from = fromTxt.split(":");
    const fromHH = parseInt(from[0] || "0", 10);
    const fromMM = parseInt(from[1] || "0", 10);

    const to = toTxt.split(":");
    const toHH = parseInt(to[0] || "0", 10);
    const toMM = parseInt(to[1] || "0", 10);

    return fromHH * 60 + fromMM < toHH * 60 + toMM;
  };

  static async formatFilePath(file: StorageMediaAttachemt) {
    if (Platform.OS === "android") {
      return { formattedName: file.filename, formattedPath: file.path };
    }
    let formattedName = file.filename;
    let formattedPath = file.path;
    //Format  Gallery Image in iOS exclude camera Image
    if (file.mime && file.mime.toLowerCase() === "image") {
      const splittedName = formattedName.split(".");
      if (splittedName.length >= 2) {
        formattedName = formattedName.replace(
          RegExp(`(.*).${splittedName[splittedName.length - 1]}`, "i"),
          "$1.jpg",
        );
        const destination = `${RNFS.TemporaryDirectoryPath}${formattedName}`;
        const isFileExisted = await RNFS.exists(destination);
        if (!isFileExisted) {
          await RNFS.copyAssetsFileIOS(file.path, destination, 0, 0);
        }
        formattedPath = `file://${destination}`;
      }
    }

    //Format MOV file
    if (
      file.mime &&
      file.mime.toLowerCase().includes("video") &&
      MOV_REG.test(formattedName)
    ) {
      formattedName = formattedName.replace(MOV_REG, "$1.mp4");
      const destination = `${RNFS.TemporaryDirectoryPath}${formattedName}`;
      const isFileExisted = await RNFS.exists(destination);
      if (!isFileExisted) {
        await RNFS.copyAssetsVideoIOS(file.path, destination);
      }
      formattedPath = `file://${destination}`;
    }

    return { formattedName, formattedPath };
  }

  static convertStringToDuration(inputstring) {
    const reg = new RegExp(/[^a-zA-Z]/);
    if (reg.test(inputstring)) {
      return new Date(Math.floor(inputstring) * 1000)
        .toISOString()
        .substring(14, 19);
    }
  }

  static getRandomString = () => Math.random().toString(36).substring(2, 5);

  static formatMediaList = (storageMediaList): StorageMediaAttachemt[] => {
    return storageMediaList.edges.map(media => {
      const mediaDetail = media.node;
      return <StorageMediaAttachemt>{
        id: `${mediaDetail.image.filename}${this.getRandomString()}`,
        filename: mediaDetail.image.filename || `Image-${moment.now()}`,
        mime: mediaDetail.type,
        path: mediaDetail.image.uri,
        duration: mediaDetail.image.playableDuration,
        size: mediaDetail.image.fileSize,
        selectedIndex: -1,
        origin: "storage",
      };
    });
  };

  static addEmoji = (
    raw: TotalReaction,
    emoji: EmoijType,
    isOwnReaction: boolean = true,
  ): TotalReaction => {
    const cloneRaw: TotalReaction = _.cloneDeep(raw);

    const index = cloneRaw.data.findIndex(item => item.id === emoji);
    if (index > -1) {
      cloneRaw.data[index] = {
        id: emoji,
        total: cloneRaw.data[index].total + 1,
      };
    } else {
      cloneRaw.data.push({ id: emoji, total: 1 });
    }

    if (isOwnReaction) {
      const index2 = cloneRaw.ownerReacted.findIndex(item => item.id === emoji);
      if (index2 > -1) {
        const temp: EmojiModel[] = _.remove(
          cloneRaw.ownerReacted,
          item => item.id == emoji,
        );
        cloneRaw.ownerReacted.unshift({ ...temp[0], total: temp[0].total + 1 });
      } else {
        cloneRaw.ownerReacted.unshift({ id: emoji, total: 1 });
      }
    }

    return {
      data: cloneRaw.data.sort((a, b) => b.total - a.total),
      ownerReacted: cloneRaw.ownerReacted,
      total: cloneRaw.total + 1,
    };
  };

  static removeEmoji = (raw: TotalReaction): TotalReaction => {
    const cloneRaw: TotalReaction = _.cloneDeep(raw);
    let totalUserReacted: number = 0;

    const newData = cloneRaw.data.map(item => {
      const findItem: EmojiModel | undefined = cloneRaw.ownerReacted.find(
        emoji => emoji.id === item.id,
      );

      if (!findItem) {
        return item;
      }
      totalUserReacted += findItem.total;
      return {
        ...item,
        total: item.total - findItem.total,
      };
    });

    return {
      total: cloneRaw.total - totalUserReacted,
      data: newData,
      ownerReacted: [],
    };
  };

  static addUserEmoji = (
    raw: Reaction[],
    emoji: EmoijType,
    userData: ShortProfileUserModel,
  ): Reaction[] => {
    const cloneRaw: Reaction[] = _.cloneDeep(raw);

    const index = cloneRaw.findIndex(item => item.userId === userData.id);

    if (index > -1) {
      const ind = cloneRaw[index].data.findIndex(item => item.id == emoji);
      const newData: EmojiModel[] = _.cloneDeep(cloneRaw[index].data);

      if (ind > -1) {
        newData[ind] = { id: emoji, total: newData[ind].total + 1 };
      } else {
        newData.push({ id: emoji, total: 1 });
      }

      cloneRaw[index] = {
        ...userData,
        userId: userData.id,
        total: cloneRaw[index].total + 1,
        data: newData,
      };
    } else {
      cloneRaw.push({
        ...userData,
        userId: userData.id,
        total: 1,
        data: [{ id: emoji, total: 1 }],
      });
    }

    return cloneRaw;
  };

  static removeUserEmoji = (
    raw: Reaction[],
    userData: ShortProfileUserModel,
  ): Reaction[] => {
    const cloneRaw: Reaction[] = _.cloneDeep(raw);

    const index = cloneRaw.findIndex(item => item.userId === userData.id);

    if (index > -1) {
      return cloneRaw.filter(item => item.userId != userData.id);
    }

    return cloneRaw;
  };

  static mergeReaction = (
    previous: TotalReaction,
    current: TotalReaction,
  ): TotalReaction => {
    return current;
  };

  static nearestNormalAspectRatio(width: number, height: number, side = 1) {
    /*
     * Calculate the nearest normal aspect ratio
     *
     * width: The width of the space.
     * height: The height of the space.
     * side: The nearest ratio to side with. A number higher than zero tells the function to always return the nearest ratio that is equal or higher than the actual ratio, whereas a smaller number returns the nearest ratio higher that is equal or smaller than the actual ratio. Defaults to 0.
     * maxWidth: The maximum width in the nearest normal aspect ratio. Defaults to 16.
     * maxWidth: The maximum height in the nearest normal aspect ratio. Defaults to 16.
     *
     * https://gist.github.com/jonathantneal/d3a259ebeb46de7ab0de
     */
    const ratio = (width * 100) / (height * 100),
      // eslint-disable-next-line prefer-rest-params
      maxW = 3 in arguments ? arguments[2] : 10,
      // eslint-disable-next-line prefer-rest-params
      maxH = 4 in arguments ? arguments[3] : 10,
      ratiosW = new Array(maxW).join(",").split(","),
      ratiosH = new Array(maxH).join(",").split(","),
      ratiosT: { [key: number]: boolean } = {},
      ratios: { [key: string]: number } = {};

    let match: RatioImage | undefined;

    ratiosW.forEach(function (_, ratioW) {
      ++ratioW;

      ratiosH.forEach(function (__, ratioH) {
        ++ratioH;

        const ratioX = (ratioW * 100) / (ratioH * 100);

        if (!ratiosT[ratioX]) {
          ratiosT[ratioX] = true;

          ratios[ratioW + ":" + ratioH] = ratioX;
        }
      });
    });

    for (const key in ratios) {
      if (
        !match ||
        (!side &&
          Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match])) ||
        (side < 0 &&
          ratios[key] <= ratio &&
          Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match])) ||
        (side > 0 &&
          ratios[key] >= ratio &&
          Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match]))
      ) {
        match = key as RatioImage;
      }
    }

    return match as RatioImage;
  }

  static getExtensionFile(fileName?: string): File.FileExtension | undefined {
    const result = /^.*\.([a-zA-Z0-9]+)$/gm.exec(fileName ?? "");

    if (!result?.[1]) {
      return;
    }

    return result[1].toLowerCase() as File.FileExtension;
  }

  static detectUrl(text?: string) {
    if (!text) {
      return false;
    }

    const hyperlinkRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
    return hyperlinkRegex.test(text);
  }

  static hexColorWithOpacity(color: string, opacity: number) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      c = color.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        `,${opacity})`
      );
    }

    return color;
  }

  static formatFileSize = size => {
    let result;
    switch (true) {
      case size < 1000:
        result = size + " B";
        break;
      case size >= 1000 && size < 1000000:
        result = (size / 1000).toFixed(2) + " KB";
        break;
      case size >= 1000000:
        result = (size / 1000000).toFixed(2) + " MB";
        break;
      default:
        result = "N/A";
    }
    return result;
  };

  static getFileExtention = (fileUrl: string) => {
    const splitedFileName = fileUrl.toLowerCase().split(".");

    // To get the file extension
    return splitedFileName[splitedFileName.length - 1];
  };

  static mapEventToMarkedDate = (
    events: ScheduleModel[],
    selectedDate: string = moment().format("YYYY-MM-DD"),
  ): MyMarkedDate => {
    let markedDates = {};

    events.map(item => {
      markedDates[moment(item.start).format("YYYY-MM-DD")] = {
        marked: true,
        selected: false,
      } as MyMarkingProps;
    });

    if (selectedDate) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
      } as MyMarkingProps;
    }

    return markedDates;
  };

  static filterImageUrl = (url: string): string => {
    if (url == "https://graph.microsoft.com/v1.0/me/photo/$value") {
      return "";
    }
    return url;
  };
}
