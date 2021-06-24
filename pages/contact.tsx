import Head from 'next/head'
import { GetServerSideProps } from 'next'

const NEXTAPIURL = process.env.NEXT_PUBLIC_NEXTAPIURL

type Person = {
  name: string
}

interface ApiProps {
  person?: Person
}

const Contact = ({
  person = { name: 'No name' },
}: ApiProps = {}): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Contact Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
        <h1 className="text-6xl font-bold">Hello, {person.name}</h1>
        <textarea
          name="message"
          id="message"
          className="w-full max-w-xl h-40 mt-3 border-gray-500 border-2 rounded"
        ></textarea>
        <button
          type="button"
          onClick={() => alert('Hey!')}
          className="border-2 border-blue-300 p-2 mt-3 bg-blue-100 w-40 rounded-full"
        >
          Send.
        </button>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res: Response = await fetch(`${NEXTAPIURL}/api/hello`)
  const person: JSON = await res.json()

  return {
    props: { person },
  }
}

export default Contact
