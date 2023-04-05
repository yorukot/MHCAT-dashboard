import { useRouter } from "next/router";
import { ReactElement, useEffect, useContext } from "react";

export default function GuildsPage(guild) {
  console.log(guild)
  return <div className="page">
    Dashboard Page
  </div>;
};

export async function getServerSideProps(ctx) {
  return {
    props: {
      id: '321321321',
      name: 'dsadsa'
    }
  }
}
