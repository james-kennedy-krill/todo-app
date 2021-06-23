import Head from 'next/head'
import { GetStaticProps } from 'next'

type Post = {
  id: number
  title: string
  author: string
}

interface ApiProps {
  posts?: Post[]
}

const Posts = ({ posts = [] }: ApiProps = {}): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Posts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
        {posts.map((post: Post) => (
          <li key={`key${post.id}`}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res: Response = await fetch('http://localhost:3004/posts')
  const posts: JSON = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Posts
