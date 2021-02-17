import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="max-w-lg mx-auto flex justify-center text-lg">
        <p>
          こんにちは！magakoのブログです。
          <br />
          都内の会社で社内SEとして業務をしています！
          <br />
          下記の記事もみていただけると嬉しいです！！
        </p>
      </section>
      <section className="mt-5 text-lg pt-1 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold">Blog</h2>
        <div className="flex justify-center">
          <ul className="list-none m-0 p-0">
            {allPostsData.map(({ id, createdDate, title }) => (
              <li className="mb-5" key={id}>
                <Link href={`/posts/${id}`}>
                  <a className="text-blue-500 hover:text-blue-600">{title}</a>
                </Link>
                <br />
                <small className="text-gray-400">
                  <Date dateString={createdDate} />
                </small>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
