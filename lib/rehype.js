import {refractor} from "refractor";

import jsx from "refractor/lang/jsx";
import javascript from "refractor/lang/javascript";
import css from "refractor/lang/css";
import cssExtras from "refractor/lang/css-extras";
import jsExtras from "refractor/lang/js-extras";
import sql from "refractor/lang/sql";
import typescript from "refractor/lang/typescript";
import swift from "refractor/lang/swift";
import objectivec from "refractor/lang/objectivec";
import markdown from "refractor/lang/markdown";
import json from "refractor/lang/json";
import {visit} from 'unist-util-visit';

import {toString} from 'hast-util-to-string'

refractor.register(jsx);
refractor.register(json);
refractor.register(typescript);
refractor.register(javascript);
refractor.register(css);
refractor.register(cssExtras);
refractor.register(jsExtras);
refractor.register(sql);
refractor.register(swift);
refractor.register(objectivec);
refractor.register(markdown);

refractor.alias({ jsx: ["js"] });


const getLanguage = (node) => {
  const className = node.properties.className || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === "language-") {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
};

const rehypePrism = (options) => {
  options = options || {};

  return (tree) => {
    visit(tree, "element", visitor);
  };

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }

    let result;
    try {
      parent.properties.className = (parent.properties.className || []).concat(
        "language-" + lang
      );
      result = refractor.highlight(toString(node), lang);
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }

    node.children = result;
  }
};

export default rehypePrism;