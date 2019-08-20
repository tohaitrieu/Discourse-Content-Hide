import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => {
  opts.features["bbcode-hide"] = true;
});

function HideContent(text) {
  text = text || "";
  while (
    text !==
    (text = text.replace(
      /\[hideto=([^\]]+)\]((?:(?!\[hideto=[^\]]+\]|\[\/hideto\])[\S\s])*)\[\/hideto\]/gi,
      function(match, p1, p2) {
        return `<div class="hide_to ${p1}">${p2}</div>`;
      }
    ))
  );
  return text;
}

export function setup(helper) {
  helper.whiteList([ 'div.hide_to', 'div.guest' ]);
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^hide_to ?[a-zA-Z0-9]+$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(md => {
      const ruler = md.block.bbcode.ruler;

      ruler.push("hideto", {
        tag: "hideto",
        wrap: function(token, endToken, tagInfo) {
          token.type = "div_open";
          token.tag = "div";
          token.attrs = [
            ["class", "hide_to " + tagInfo.attrs._default.trim()]
          ];
          token.content = "";
          token.nesting = 1;

          endToken.type = "div_close";
          endToken.tag = "div";
          endToken.nesting = -1;
          endToken.content = "";
        }
      });
    });
  } else {
    
    helper.addPreProcessor(text => HideContent(text));
  }
}
