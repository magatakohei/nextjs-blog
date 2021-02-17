import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import Markdown from "markdown-to-jsx";
import Prism from "prismjs";
import { useEffect } from "react";

export default function Post({ postData }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className="text-4xl leading-snug font-extrabold tracking-tighter my-5">
          {postData.title}
        </h1>
        <div className="text-gray-500">
          <Date dateString={postData.createdDate} />
        </div>
        <Markdown>{postData.contentHtml}</Markdown>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
