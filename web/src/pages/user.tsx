import { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getSession, signOut } from "next-auth/react";

export async function getServerSideProps({ req, _res }: { req: NextApiRequest, _res: NextApiResponse }) {
  const session = await getSession({ req });

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

// gets a prop from getServerSideProps
function User({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h4>User session:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>
    </div>
  );
}

export default User;
