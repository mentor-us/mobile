import React, {memo, useEffect, useMemo, useState} from "react";
import {Linking} from "react-native";
import HTML, {
  defaultSystemFonts,
  HTMLContentModel,
  HTMLElementModel,
  MixedStyleDeclaration,
} from "react-native-render-html";
import clip from "text-clipper";

import Helper from "~/utils/Helper";
import FontSize from "~/constants/FontSize";

import {Color} from "~/constants/Color";
import {screenWidth} from "~/constants";

interface Props {
  text: string;
  isFullDetail?: boolean;
  pressable?: boolean;
  ignoreBreakLineString?: boolean;
  listHashtags?: string[];
  onPressHashTag?: (hashtag: string) => void;
  onSeemore?: () => void;
  onPressUserMentioned?: (domain: string) => void;
  numberOfLines?: number;
  style?: MixedStyleDeclaration;
}

const HTML_REG = RegExp(/<\/?[a-z][\s\S]*>/);

const systemFonts = [...defaultSystemFonts];

const getMaxStringLength = (lines: number) => {
  switch (lines) {
    case 0:
    case 1:
      return 260;
    case 2:
      return 220;
    default:
      return 180;
  }
};

const replaceHashtags = (text: string, listHashtags: string[]): string => {
  const uniqueHashtags = [...new Set(listHashtags)];
  let html = text;
  uniqueHashtags.sort((a, b) => a.length - b.length);
  uniqueHashtags.forEach(hashtag => {
    if (
      !hashtag ||
      (text.indexOf(hashtag) > 0 &&
        text[text.indexOf(hashtag) - 1].match(/[a-zA-Z0-9]/))
    ) {
      return;
    }
    //Check only replace when hashtag have white space before or at the begining of string
    const reg = new RegExp(`${hashtag}(?!\\w)`, "g");

    html = html.replace(
      reg,
      ` <a href="${hashtag}" style="text-decoration: none;">${hashtag}</a>`,
    );
  });
  return html;
};

const customHTMLElementModels = {
  seemore: HTMLElementModel.fromCustomModel({
    tagName: "seemore",
    mixedUAStyles: {
      color: Color.seeMoreColor,
      fontWeight: "normal", // force fontweight
    },
    contentModel: HTMLContentModel.textual,
  }),
  mention: HTMLElementModel.fromCustomModel({
    tagName: "mention",
    mixedUAStyles: {
      color: Color.primary,
      fontWeight: "normal", // force fontweight
    },
    contentModel: HTMLContentModel.textual,
  }),
};

const TextFormatRenderer = ({
  text,
  isFullDetail,
  ignoreBreakLineString,
  listHashtags = [],
  numberOfLines,
  style,
  onPressHashTag,
  onSeemore,
  onPressUserMentioned,
}: Props) => {
  const [source, setSource] = useState<string>("");

  const convertToHTML = (input: string, hashtagList: string[]): string => {
    if (input) {
      let html = input;
      html = Helper.decodeHTML(html);

      if (!ignoreBreakLineString) {
        html = html.replace(/\n/g, "<br/>");
      }
      if (!isFullDetail) {
        const splitHTML = html.split("<br/>");
        const shortenHTML: string[] = [];
        for (const trunk of splitHTML) {
          shortenHTML.push(trunk);
          if (shortenHTML.join().length > 260) {
            break;
          }
        }
        html = shortenHTML.join("<br/>");
        const breakLineTimes = (html.match(/<br\/>/g) || []).length;
        try {
          html = clip(html, getMaxStringLength(breakLineTimes), {
            html: HTML_REG.test(html),
            indicator: `<seemore>...Xem thêm</seemore>`,
          });
        } catch (error) {
          console.log("@DUKE HTML ERROR:", error);
        }
      }
      html = replaceHashtags(html, hashtagList);
      return html;
    }
    return "";
  };

  const tagsStyles: Record<string, MixedStyleDeclaration> = useMemo(
    () => ({
      body: {
        fontSize: FontSize.large,
        textDecorationColor: Color.transparent,
        lineHeight: FontSize.huge,
        ...style,
      },
      div: {
        fontSize: FontSize.large,
        textDecorationColor: Color.transparent,
        lineHeight: FontSize.huge,
        ...style,
      },
      a: {
        color: Color.primary,
        textDecorationColor: Color.transparent,
      },
      b: {
        fontWeight: "bold",
      },
    }),
    [style],
  );

  const SeemoreRenderer = ({TDefaultRenderer, ...props}) => {
    return <TDefaultRenderer {...props} onPress={onSeemore} />;
  };

  const MentionRenderer = ({TDefaultRenderer, tnode, ...props}) => {
    return (
      <TDefaultRenderer
        tnode={tnode}
        {...props}
        onPress={() =>
          onPressUserMentioned?.(tnode.domNode.attribs.domain ?? "")
        }
      />
    );
  };

  const LinkRenderer = ({TDefaultRenderer, tnode, ...props}) => {
    return (
      <TDefaultRenderer
        tnode={tnode}
        {...props}
        onPress={async () => {
          const ref = tnode.domNode.children?.[0]?.data;
          if (ref) {
            if (ref.includes("https://")) {
              // Check neu laf URL thi dung linking de mo, neu la cai khac thi dung hashtag
              await Linking.openURL(ref);
            } else {
              ///Post's hashtag
              onPressHashTag?.(ref.slice(ref.indexOf("#")));
            }
          }
        }}
      />
    );
  };

  const renderers = useMemo(
    () => ({
      seemore: SeemoreRenderer,
      mention: MentionRenderer,
      a: LinkRenderer,
    }),
    [onSeemore],
  );

  useEffect(() => {
    setSource(convertToHTML(text, listHashtags));
  }, [text, isFullDetail]);

  return (
    <HTML
      source={{html: source}}
      contentWidth={screenWidth}
      systemFonts={systemFonts}
      tagsStyles={tagsStyles}
      defaultTextProps={{numberOfLines}}
      renderers={renderers}
      customHTMLElementModels={customHTMLElementModels}
    />
  );
};

export default memo(TextFormatRenderer);
