// import {Alert, Dimensions, Linking, Platform, ScaledSize} from 'react-native';
// import RNFS from 'react-native-fs';
// import {decode} from 'html-entities';
// import moment from 'moment';
// import qs from 'qs';

// import {AttachmentType, deviceWidth} from '@constants';
// import {UtilServices} from '@services';
// import i18n from '@app/i18n';
// import LocaleKeys from '@app/i18n/resources/LocaleKeys';

// const configTranslateDefault = {
//   lang: 'en',
//   keyDefault: 'name',
//   keyTranslate: 'name',
//   keyLanguages: 'languages',
//   keyItemLang: 'lang',
// };

// const MOV_REG = RegExp(/(.*).mov/i);
// const MENTION_REG = /({{(\d+)}})/gm;
// export const HASHTAG_REG =
//   /#([a-z-A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ])*\s/gm;

// const LIST_HASHTAG_REG =
//   /#([a-z-A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+)\s*?/gm;
// const HASHTAG_TYPING_REG =
//   /#([a-z-A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)*$/gs;
// const MENTION_TAG_REG =
//   /@([a-z-A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)*$/gs;

// const GIPHY_REG = /https:.*\.giphy\.com\/.*\.gif/gm;

// const PLATFORM_LIST = ['Skype', 'Zoom.', 'Meet.Google', 'Teams'];

// const DETECT_URLS =
//   /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

// class NativeHelper {
//   static phoneCall(phoneNumber?: string) {
//     if (phoneNumber) {
//       const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
//       let scheme: string;
//       if (Platform.OS === 'android') {
//         scheme = `tel:${formattedPhoneNumber}`;
//       } else {
//         scheme = `telprompt:${formattedPhoneNumber}`;
//       }
//       Linking.openURL(scheme);
//     } else {
//       Alert.alert('Không thể truy cập số điện thoại.');
//     }
//   }

//   static partition = (ary, callback) =>
//     ary.reduce(
//       (acc, e) => {
//         acc[callback(e) ? 0 : 1].push(e);
//         return acc;
//       },
//       [[], []],
//     );

//   static async openZaloApp(zaloNumber: string, displayName: string) {
//     try {
//       if (zaloNumber && zaloNumber !== 'N/A') {
//         await Linking.openURL(`https://zalo.me/${zaloNumber}`);
//       }
//     } catch (error) {
//       Alert.alert(`Không thể liên hệ Zalo ${displayName}`);
//     }
//   }

//   static async openTeamsApp(workingMail: string, displayName: string) {
//     try {
//       if (workingMail && workingMail !== 'N/A') {
//         await Linking.openURL(
//           `https://teams.microsoft.com/l/chat/0/0?users=${workingMail}`,
//         );
//       }
//     } catch (error) {
//       Alert.alert(`Không thể liên hệ Teams ${displayName}`);
//     }
//   }

//   static async sendEmail(
//     workingMail: string,
//     options?: {
//       subject?: string;
//       body?: string;
//       cc?: string;
//       bcc?: string;
//       displayName?: string;
//     },
//   ) {
//     try {
//       if (workingMail && workingMail !== 'N/A') {
//         let url = `mailto:${workingMail}`;

//         const query = qs.stringify({
//           subject: options?.subject,
//           body: options?.body,
//           cc: options?.cc,
//           bcc: options?.bcc,
//         });

//         if (query.length) {
//           url += `?${query}`;
//         }

//         const canOpen = await Linking.canOpenURL(url);
//         if (!canOpen) {
//           throw new Error('Provided URL can not be handled');
//         }

//         return Linking.openURL(url);
//       }
//     } catch (error) {
//       Alert.alert(
//         `Không thể gửi mail đến ${options?.displayName || workingMail}`,
//       );
//     }
//   }

//   static openZalo(phoneNumber = '', nameDisplay = '') {
//     const phone = this.getPhoneZalo(phoneNumber ?? '');
//     if (__DEV__) {
//       console.log(`=========> Phone: ${phone}`);
//     }
//     const REGEX_PHONE = /((84|0)[3|5|7|8|9])+([0-9]{8})\b/;
//     if (phone && REGEX_PHONE.test(phone)) {
//       Linking.openURL(`https://zalo.me/${phone}`);
//     } else {
//       Alert.alert(`Không thể liên hệ Zalo ${nameDisplay}`);
//     }
//   }

//   static getDayOfWorks = date => {
//     try {
//       const now = moment();
//       const years = now.diff(date, 'years');

//       let days = now.diff(date, 'days');
//       days -= years * 365;

//       const result = `${days} day${days > 1 ? 's' : ''} of work`;

//       if (years < 1) {
//         return result;
//       }

//       return `${years} year${years > 1 ? 's' : ''} and ${result}`;
//     } catch (error) {
//       console.log(error);
//     }
//     return 'N/A';
//   };

//   static getPhoneZalo(phone) {
//     const REGEX_NATION_CODE = /(?:\(.)(.*?)(?=\))/;
//     const nationCode = REGEX_NATION_CODE.exec(phone);
//     if (nationCode && Array.isArray(nationCode) && nationCode.length !== 0) {
//       let phoneNumber = phone.split(' ');
//       if (nationCode[1] === '84') {
//         phoneNumber = phoneNumber[1].slice(1);
//         return nationCode[1] + phoneNumber;
//       }

//       return nationCode[1] + phoneNumber[1];
//     }

//     return phone;
//   }

//   static formatPhoneNumber(phone: string) {
//     const REGEX_NATION_CODE =
//       /([+84|84|0]*(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
//     const nationCode = REGEX_NATION_CODE.exec(phone);
//     if (nationCode && Array.isArray(nationCode) && nationCode.length !== 0) {
//       let phoneNumber = nationCode[0].replace(/ /g, '');
//       if (phoneNumber) {
//         if (phoneNumber.startsWith('+84') || phoneNumber.startsWith('84')) {
//           phoneNumber = phoneNumber.replace('+84', '');
//           phoneNumber = phoneNumber.replace('84', '');
//         }

//         if (!phoneNumber.startsWith('0')) {
//           phoneNumber = '0' + phoneNumber;
//         }
//         return phoneNumber;
//       }
//       return phone;
//     }

//     return phone;
//   }

//   static isPhoneNumber(phone) {
//     const REGEX_NATION_CODE = /([+84|84|0]*(3|5|7|8|9|1[2|6|8|9]))+(\d{8})\b/;
//     return REGEX_NATION_CODE.test(phone);
//   }

//   static isEmail(input) {
//     const EMAIL_REGEX =
//       /^[a-zA-Z0-9_]+?[.[a-zA-Z0-9]{0,}@[a-zA-Z_]+?(\.[a-zA-Z_]{2,}){1,3}$/;
//     return EMAIL_REGEX.test(input);
//   }

//   static responseSizeHeight(
//     pixel = 0,
//     config?: {
//       minWidth?: number;
//       maxWidth?: number;
//       minHeight?: number;
//       dimensions?: ScaledSize;
//     },
//   ) {
//     const heightDesign = 812;

//     const {height} = config?.dimensions ?? Dimensions.get('window');

//     const result = (pixel / heightDesign) * height;
//     const _min = config?.minHeight ?? result;

//     return _min > result ? _min : result;
//   }

//   static responseSizeWidth(
//     pixel = 0,
//     config?: {
//       minWidth?: number;
//       maxWidth?: number;
//       minHeight?: number;
//       dimensions?: ScaledSize;
//     },
//   ) {
//     const widthDesign = 375;

//     const {width} = config?.dimensions ?? Dimensions.get('window');

//     const result = (pixel / widthDesign) * width;

//     const _min = Math.max(config?.minWidth ?? result, result);

//     if (config?.maxWidth) {
//       Math.min(config?.maxWidth, _min);
//     }
//     return _min;
//   }

//   static responsiveFont({
//     fontSize = 14,

//     /**Extra font is double [1.0, 2.0] */
//     factorExtra = 1.0,
//     maxFontSize = 20,
//   }) {
//     const widthDesign = 375;

//     const result = (fontSize / widthDesign) * deviceWidth;

//     return Math.min(result * factorExtra, maxFontSize);
//   }

//   static getTranslateData(data, config = configTranslateDefault) {
//     const _config = {
//       ...configTranslateDefault,
//       ...config,
//     };

//     const itemFound = data?.[_config.keyLanguages]?.find?.(
//       element => element[_config.keyItemLang] === _config.lang,
//     );

//     if (itemFound && itemFound[_config.keyTranslate]) {
//       return itemFound[_config.keyTranslate];
//     }

//     if (data && data[_config.keyDefault]) {
//       return data[_config.keyDefault];
//     }

//     return '';
//   }

//   static convertViToEn(_str) {
//     let str = _str;
//     str = str.replace(
//       /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|Á|À|Ả|Ã|Ạ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ/g,
//       'a',
//     );
//     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, 'e');
//     str = str.replace(/ì|í|ị|ỉ|ĩ|Í|Ì|Ỉ|Ĩ|Ị/g, 'i');
//     str = str.replace(
//       /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g,
//       'o',
//     );
//     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, 'u');
//     str = str.replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, 'y');
//     str = str.replace(/đ|Đ/g, 'd');
//     // Some system encode vietnamese combining accent as individual utf-8 characters
//     str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
//     str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

//     return str;
//   }

//   static getTime = dateStr => {
//     return moment(dateStr).format('HH:mm');
//   };
//   static trimLink = (link = '') => {
//     let linkPlatform = PLATFORM_LIST.find(platform =>
//       link.includes(platform.toLowerCase()),
//     );
//     switch (linkPlatform) {
//       case 'Teams':
//         linkPlatform = 'Microsoft Teams';
//         break;
//       case 'Meet.Google':
//         linkPlatform = 'Google Meet';
//         break;
//       case 'Zoom.':
//         linkPlatform = 'Zoom';
//         break;
//       case 'Skype':
//         linkPlatform = 'Skype';
//         break;
//       default:
//         break;
//     }
//     return linkPlatform ?? link;
//   };

//   static isMeetingLink = (link = '') => {
//     const linkPlatform = PLATFORM_LIST.find(platform =>
//       link.includes(platform.toLowerCase()),
//     );
//     return !!linkPlatform;
//   };

//   static getDuration = (start, end) => {
//     const rawDuration = moment.duration(moment(end).diff(moment(start)));
//     const day = rawDuration.days();
//     const hour = rawDuration.hours();
//     const min = rawDuration.minutes();

//     const displayDay = day > 0 ? day + 'd' : '';
//     const displayHour = hour > 0 ? hour + 'h' : '';
//     const displayMin = min > 0 ? (min > 9 ? min + "'" : '0' + min + "'") : '';

//     if (!displayDay) {
//       return `${displayHour}${displayMin}`;
//     }

//     return `${displayDay} ${displayHour}${displayMin}`;
//   };

//   static getCalendarFormat = (showTimeOnly, hasYearFormat) => {
//     const calendarFormat = {
//       sameDay: `${
//         showTimeOnly ? '' : `[${i18n.t(LocaleKeys.vngEventsToday)}]`
//       } HH:mm`,
//       nextDay: `${
//         showTimeOnly ? '' : `[${i18n.t(LocaleKeys.vngEventsTomorrow)}]`
//       } HH:mm`,
//       sameElse: `${
//         showTimeOnly ? '' : `ddd, MMM DD ${hasYearFormat ? 'YYYY' : ''},`
//       } HH:mm`,
//       nextWeek: `${
//         showTimeOnly ? '' : `ddd, MMM DD ${hasYearFormat ? 'YYYY' : ''},`
//       } HH:mm`,
//       lastDay: `${
//         showTimeOnly ? '' : `ddd, MMM DD ${hasYearFormat ? 'YYYY' : ''},`
//       } HH:mm`,
//       lastWeek: `${
//         showTimeOnly ? '' : `ddd, MMM DD ${hasYearFormat ? 'YYYY' : ''},`
//       } HH:mm`,
//     };
//     return calendarFormat;
//   };

//   static formatEventTime = (
//     startDate: string,
//     endDate: string,
//     showFullDate = false,
//   ): string => {
//     let formatStartDate = '';
//     let formatEndDate = '';

//     moment.locale(i18n.language);
//     const hasYearFormat = moment(endDate).diff(startDate, 'years') > 0;
//     const isInDayEvent = moment(endDate).diff(startDate, 'days') === 0;

//     if (showFullDate && isInDayEvent) {
//       formatStartDate = moment(startDate).calendar(
//         null,
//         this.getCalendarFormat(true, hasYearFormat),
//       );
//       formatEndDate = moment(endDate).calendar(
//         null,
//         this.getCalendarFormat(true, hasYearFormat),
//       );
//     } else {
//       formatStartDate = moment(startDate).calendar(
//         null,
//         this.getCalendarFormat(false, hasYearFormat),
//       );
//       //do not show end event prefix on during the day event
//       formatEndDate = moment(endDate).calendar(
//         null,
//         this.getCalendarFormat(isInDayEvent, hasYearFormat),
//       );
//     }
//     return `${formatStartDate} - ${formatEndDate}`;
//   };

//   static formatLocation = location => {
//     if (location) {
//       let formattedLocation = '';
//       const locationArr = location.split(';');
//       if (locationArr.length > 1) {
//         //when location has both link & room, get room only
//         const rooms = locationArr.filter(item => !item.includes('https://'));
//         formattedLocation = rooms.join('\n');
//       } else {
//         formattedLocation = location;
//       }
//       return formattedLocation;
//     }
//     return null;
//   };

//   static isOnGoingEvent = (start, end) => {
//     return moment().isBetween(moment(start), moment(end));
//   };

//   static isEndedEvent = end => {
//     return moment(end).isBefore(moment(), 'minutes');
//   };

//   static getRandomString = () => Math.random().toString(36).substring(2, 5);

//   static ordinalSuffixOf(i) {
//     const j = i % 10;
//     const k = i % 100;
//     if (j === 1 && k !== 11) {
//       return i + 'st';
//     }
//     if (j === 2 && k !== 12) {
//       return i + 'nd';
//     }
//     if (j === 3 && k !== 13) {
//       return i + 'rd';
//     }
//     return i + 'th';
//   }

//   static convertLocaleWithArgumentToMoment(input = '') {
//     let text = input;

//     const frontBracket = /([}]+)([a-z0-9\s.-_])/g;
//     const backBracket = /([a-z0-9\s.-_])([{]+)/g;
//     const headLineBracket = /^[a-z0-9\s]+/g;
//     const endLineBracket = /[a-z0-9\s._]+$/g;

//     text = text.toString().replace(frontBracket, (match, separator, char) => {
//       return separator + '[' + char;
//     });

//     text = text.toString().replace(backBracket, (match, separator, char) => {
//       return separator + ']' + char;
//     });

//     text = text
//       .toString()
//       .replace(headLineBracket, (match, separator, char) => {
//         return '[' + char;
//       });

//     text = text.toString().replace(endLineBracket, match => {
//       return match + ']';
//     });

//     return text;
//   }

//   static capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

//   static convertStringToDuration(inputstring) {
//     const reg = new RegExp(/[^a-zA-Z]/);
//     if (reg.test(inputstring)) {
//       return new Date(Math.floor(inputstring) * 1000)
//         .toISOString()
//         .substring(14, 19);
//     }
//   }

//   static async formatFilePath(file) {
//     if (Platform.OS === 'android') {
//       return {formattedName: file.filename, formattedPath: file.path};
//     }
//     let formattedName = file.filename;
//     let formattedPath = file.path;
//     //Format  Gallery Image in iOS exclude camera Image
//     if (file.mime.toLowerCase() === 'image') {
//       const splittedName = formattedName.split('.');
//       if (splittedName.length >= 2) {
//         formattedName = formattedName.replace(
//           RegExp(`(.*).${splittedName[splittedName.length - 1]}`, 'i'),
//           '$1.jpg',
//         );
//         const destination = `${RNFS.TemporaryDirectoryPath}${formattedName}`;
//         const isFileExisted = await RNFS.exists(destination);
//         if (!isFileExisted) {
//           await RNFS.copyAssetsFileIOS(file.path, destination, 0, 0);
//         }
//         formattedPath = `file://${destination}`;
//       }
//     }

//     //Format MOV file
//     if (
//       file.mime.toLowerCase().includes('video') &&
//       MOV_REG.test(formattedName)
//     ) {
//       formattedName = formattedName.replace(MOV_REG, '$1.mp4');
//       const destination = `${RNFS.TemporaryDirectoryPath}${formattedName}`;
//       const isFileExisted = await RNFS.exists(destination);
//       if (!isFileExisted) {
//         await RNFS.copyAssetsVideoIOS(file.path, destination);
//       }
//       formattedPath = `file://${destination}`;
//     }

//     return {formattedName, formattedPath};
//   }

//   static decodeHTML = (input: string): string => {
//     if (!input) {
//       return input;
//     }
//     let result = input
//       .replace(/^.*&lt;body&gt;(.*?)&lt;\/body&gt;.*$/g, '$1')
//       .replace(/\*BR\*(.*?)<\*\/BR\*>/g, '<br>$1</br>')
//       .replace(/\*B\*(.*?)\*\/B\*/g, '<b>$1</b>')
//       .replace(/\*BR\**\/BR\*/g, '<br/>')
//       /**Bị dư sau khi dùng api translate */
//       .replace(/\*+\/BR\*+/g, '<br/>')
//       .replace(/\*U\*(.*?)\*\/U\*/g, '<u>$1</u>')
//       .replace(/\*I\*(.*?)\*\/I\*/g, '<u>$1</u>')
//       .replace(
//         /(\*URL\*(.*?)\[(.*?)\]\((.*?)\)\*\/URL\*)/g,
//         (_, __, p1, p2, p3) => {
//           const link = `<a href=${p3} style="text-decoration: none;">${p2}</a>`;
//           if (p1) {
//             return `${p1} ${link}`;
//           }

//           return `<a href=${p3} style="text-decoration: none;">${p2}</a>`;
//         },
//       );
//     result = decode(result);
//     result = this.formatHTMLTag(result);
//     return result;
//   };

//   static formatHTMLTag = (htmlInput: string) => {
//     return htmlInput
//       .replace(/<body>((.|\n)*?)<\/body>/g, '$1')
//       .replace(/<p(.*?)>((.|\n)*?)<\/p>/g, '$2')
//       .replace(/<p>((.|\n)*?)<\/p>/g, '$1')
//       .replace(/<span(.*?)>((.|\n)*?)<\/span>/g, '$2')
//       .replace(/<span>((.|\n)*?)<\/span>/g, '$1')
//       .replace(/< br \/>| < br \/ >/g, '')
//       .replace(/<p>((.|\n)*?)<\/p>/g, '$1')
//       .replace(/<img (.*?)\/>/g, '')
//       .replace(/\n/, '');
//   };

//   static formatFileSize = size => {
//     let result;
//     switch (true) {
//       case size < 1000:
//         result = size + ' B';
//         break;
//       case size >= 1000 && size < 1000000:
//         result = (size / 1000).toFixed(2) + ' KB';
//         break;
//       case size >= 1000000:
//         result = (size / 1000000).toFixed(2) + ' MB';
//         break;
//       default:
//         result = 'N/A';
//     }
//     return result;
//   };

//   static translateHTML = async (rawHTML: string, targetLanguage: string) => {
//     try {
//       const formattedHTML = this.decodeHTML(rawHTML);
//       const translatedResult = await UtilServices.translate(
//         formattedHTML,
//         targetLanguage,
//       );
//       return this.formatHTMLTag(translatedResult);
//     } catch (error) {
//       console.log('Error on translate HTML: ', error);
//       return rawHTML;
//     }
//   };

//   static getMediaAttachmentList = attachment => {
//     return attachment
//       .filter(
//         attach =>
//           (attach.type === AttachmentType.Image ||
//             attach.type === AttachmentType.Video) &&
//           (attach.image || attach.video || attach.link),
//       )
//       .reduce((currAttch, nextAttach) => {
//         switch (nextAttach?.type) {
//           case AttachmentType.Image: {
//             //Special case: some Link type has Image Type
//             if (
//               nextAttach.link &&
//               (!nextAttach.image || nextAttach.image.length === 0)
//             ) {
//               currAttch.push({
//                 type: AttachmentType.Image,
//                 thumbnail: nextAttach.link?.thumbnail ?? '',
//                 url: nextAttach.link?.url ?? '',
//               });
//             } else if (nextAttach.image) {
//               nextAttach.image.forEach(item => {
//                 if (item) {
//                   currAttch.push({
//                     type: AttachmentType.Image,
//                     thumbnail: item.thumbnail ?? '',
//                     url: item.big ?? '',
//                   });
//                 }
//               });
//             }
//             break;
//           }
//           case AttachmentType.Video: {
//             currAttch.push({
//               type: AttachmentType.Video,
//               thumbnail: nextAttach.video?.url ?? '',
//               url: nextAttach.video?.url ?? '',
//             });
//             break;
//           }
//           case AttachmentType.Link: {
//             currAttch.push({
//               type: AttachmentType.Image,
//               thumbnail: nextAttach.link?.thumnail ?? '',
//               url: nextAttach.link?.url ?? '',
//             });
//             break;
//           }
//         }
//         return currAttch;
//       }, []);
//   };

//   static truncateWhiteSpace(text) {
//     if (typeof text !== 'string') {
//       return text;
//     }

//     return (text ?? '').replace(/^\s+|\s(?=\s|$)|\s+$/gm, '');
//   }

//   static getExtensionFile(fileName?: string): File.FileExtension | undefined {
//     const result = /^.*\.([a-zA-Z0-9]+)$/gm.exec(fileName ?? '');

//     if (!result?.[1]) {
//       return;
//     }

//     return result[1].toLowerCase() as File.FileExtension;
//   }

//   static isDocFile = (extension: File.FileExtension) => {
//     const extFile = this.getExtensionFile(extension) ?? extension.toLowerCase();

//     const FILE_SUPPORT: File.FileExtension[] = [
//       'pdf',
//       'doc',
//       'docx',
//       'ppt',
//       'pptx',
//       'xls',
//       'xlsx',
//       'mp4',
//       'mov',
//     ];

//     return FILE_SUPPORT.includes(extFile as File.FileExtension);
//   };

//   static isMediaFile = (extension: File.FileExtension) => {
//     const extFile = this.getExtensionFile(extension) ?? extension.toLowerCase();

//     const FILE_SUPPORT: File.FileExtension[] = [
//       'webp',
//       'png',
//       'jpg',
//       'jpeg',
//       'heic',
//     ];

//     return FILE_SUPPORT.includes(extFile as File.FileExtension);
//   };

//   static getShiftStatus = (
//     currentStatus: Form.ShiftStatus,
//     type: 'afternoon' | 'morning',
//   ): Form.ShiftStatus => {
//     switch (currentStatus) {
//       case 'full':
//         return type === 'afternoon' ? 'morning' : 'afternoon';
//       case 'afternoon':
//         return type === 'afternoon' ? 'unknown' : 'full';
//       case 'morning':
//         return type === 'afternoon' ? 'full' : 'unknown';
//       case 'unknown':
//         return type;
//       default:
//         return currentStatus;
//     }
//   };

//   static getPortalActionType = (link: string) => {
//     if (
//       link.startsWith('https://my.vng.vn/form_portal/detail') ||
//       link.startsWith('https://my-staging.vng.vn/form_portal/detail') ||
//       link.startsWith('https://my-uat.vng.vn/form_portal/detail')
//     ) {
//       const type = link.replace(new RegExp('.*' + 'request='), '');
//       return type.toLowerCase();
//     }
//     return undefined;
//   };

//   /**Ước số chung lớn nhất */
//   static highestCommonFactor(a: number, b: number) {
//     const _a = +a.toFixed(0);
//     const _b = +b.toFixed(0);

//     if (_b === 0) {
//       return _a;
//     }

//     return this.highestCommonFactor(_b, _a % _b);
//   }

//   static getRatioImage(width: number, height: number) {
//     const htf = this.highestCommonFactor(width, height);
//     return `${width / htf}:${height / htf}` as RatioImage;
//   }

//   static nearestNormalAspectRatio(width: number, height: number, side = 1) {
//     /*
//      * Calculate the nearest normal aspect ratio
//      *
//      * width: The width of the space.
//      * height: The height of the space.
//      * side: The nearest ratio to side with. A number higher than zero tells the function to always return the nearest ratio that is equal or higher than the actual ratio, whereas a smaller number returns the nearest ratio higher that is equal or smaller than the actual ratio. Defaults to 0.
//      * maxWidth: The maximum width in the nearest normal aspect ratio. Defaults to 16.
//      * maxWidth: The maximum height in the nearest normal aspect ratio. Defaults to 16.
//      *
//      * https://gist.github.com/jonathantneal/d3a259ebeb46de7ab0de
//      */
//     const ratio = (width * 100) / (height * 100),
//       // eslint-disable-next-line prefer-rest-params
//       maxW = 3 in arguments ? arguments[2] : 10,
//       // eslint-disable-next-line prefer-rest-params
//       maxH = 4 in arguments ? arguments[3] : 10,
//       ratiosW = new Array(maxW).join(',').split(','),
//       ratiosH = new Array(maxH).join(',').split(','),
//       ratiosT: {[key: number]: boolean} = {},
//       ratios: {[key: string]: number} = {};

//     let match: RatioImage | undefined;

//     ratiosW.forEach(function (_, ratioW) {
//       ++ratioW;

//       ratiosH.forEach(function (__, ratioH) {
//         ++ratioH;

//         const ratioX = (ratioW * 100) / (ratioH * 100);

//         if (!ratiosT[ratioX]) {
//           ratiosT[ratioX] = true;

//           ratios[ratioW + ':' + ratioH] = ratioX;
//         }
//       });
//     });

//     for (const key in ratios) {
//       if (
//         !match ||
//         (!side &&
//           Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match])) ||
//         (side < 0 &&
//           ratios[key] <= ratio &&
//           Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match])) ||
//         (side > 0 &&
//           ratios[key] >= ratio &&
//           Math.abs(ratio - ratios[key]) < Math.abs(ratio - ratios[match]))
//       ) {
//         match = key as RatioImage;
//       }
//     }

//     return match as RatioImage;
//   }

//   static encodeMentionComment(
//     message: string,
//     pairKeyMention: Social.PairKeyMention,
//   ) {
//     let result = message;
//     for (const userId in pairKeyMention) {
//       result = result.replace(pairKeyMention[userId], `{{${userId}}}`);
//     }

//     return result;
//   }

//   static decodeMentionComment(
//     message: string,
//     pairKeyMention: Social.PairKeyMention,
//   ) {
//     const result = message.replace(MENTION_REG, (_, m1, m2) => {
//       return pairKeyMention[m2] ?? m1;
//     });

//     return result;
//   }

//   /**Lấy chuỗi query trong cú pháp mention
//    * - Nếu value = undefined -> sai format
//    */
//   static getTagMention(message: string) {
//     const result = message.match(MENTION_TAG_REG);
//     return result?.length ? result[0].replace('@', '') : undefined;
//   }

//   static getLinkText(message: string) {
//     const result = message.match(DETECT_URLS);
//     return result?.length ? result : undefined;
//   }

//   static getMentionText(message: string, mention: any) {
//     let formatedMessage = message;
//     Object.keys(mention).forEach(function (key) {
//       formatedMessage = formatedMessage.replace(
//         `{{${key}}}`,
//         `<mention userId=${key} domain=${mention[key].domain}>${mention[key].displayName}</mention>`,
//       );
//     });

//     return formatedMessage;
//   }

//   static getTypingHashtag(message: string) {
//     const result = message.match(HASHTAG_TYPING_REG);
//     return result?.length ? result[0] : undefined;
//   }

//   static getHastagList(message: string) {
//     const result = message.match(HASHTAG_REG);
//     return result?.length ? result : [];
//   }

//   static transformToHashTagList(message?: string) {
//     if (!message) {
//       return [];
//     }

//     const results = message.match(LIST_HASHTAG_REG);

//     return results?.length ? (results as string[]) : [];
//   }

//   static detectUrl(text?: string) {
//     if (!text) {
//       return false;
//     }

//     const hyperlinkRegex =
//       /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
//     return hyperlinkRegex.test(text);
//   }

//   static isGiphyUrl(url?: string) {
//     if (url) {
//       return GIPHY_REG.test(url);
//     }
//     return false;
//   }
// }

// export default NativeHelper;

export const temp = 1;
