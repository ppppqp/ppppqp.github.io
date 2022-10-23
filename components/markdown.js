import React, { Fragment } from "react";
import unified from "unified";
import parse from "remark-parse";
import rehypePrism from "./rehype-prism";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";

const processor = unified()
  .use(parse)
  .use(remark2rehype)
  .use(rehypePrism)
  .use(rehype2react, {
    createElement: React.createElement,
  });

const Markdown = (props) => {
  return <Fragment>{processor.processSync(props.source).contents}</Fragment>;
};

export default Markdown;