import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import { remark } from 'remark';
import {unified} from 'unified'
import html from 'remark-html';
import rehypeFormat from "rehype-format";

import parse from "remark-parse";
// import rehypePrism from "./rehype";
import rehypeHighlight from 'rehype-highlight'
import remark2rehype from "remark-rehype";
import rehypeStringify from 'rehype-stringify'
// import rehype2react from "rehype-react";


const processor = unified()
  .use(parse)
  .use(remarkGfm)
  .use(remarkGemoji)
  .use(remark2rehype)
  .use(rehypeFormat)
  .use(rehypeHighlight)
  .use(rehypeStringify);
  // .use(rehype2react, {
  //   createElement: React.createElement,
  // });

const postsDirectory = path.join(process.cwd(), 'posts');
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  const result =  allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
  return result;
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }
  export async function getPostData(id) {
    console.log(id);
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  
    // Use remark to convert markdown into HTML string
    const processedContent = processor.processSync(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }