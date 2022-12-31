import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import { useLogout } from "@thirdweb-dev/react/solana"
import type { GetServerSideProps } from "next"
import { getUser } from "../auth.config";
import { network } from "./_app";
import Image from "next/image";
import Link from "next/link"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if(!user)
    return{
      redirect: {
        destination: "/login",
        permanent: false,
      },
  };

  // Check the user has the NFT and then allow access
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );
  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  if(!nft)
    return{
      redirect: {
        destination:"/login",
        permanent: false,
      },
  };

  return{
    props: {},
  };
};

const Home = () => {
  const logout = useLogout();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#368163] -z-20 px-5">
      <p className="fixed top-5 text-xs md:text-base bg-red-500 rounded-full px-4 md:px-8 py-3 font-bold text-white mx-10">
        CITIZENS ONLY: This page is only accessible to users who have purchased & hold a PLANET VANCE NFT
      </p>

      <div className="absolute top-50 left-0 w-full h-1/2 bg-transparent -skew-y-6 z-10 overflow-hidden">
        <div className="flex items-center w-full h-full opacity-30">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center -mx-20">
            CITIZENS ONLY  CITIZENS ONLY CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
            CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY  CITIZENS ONLY
          </h1>
        </div>
      </div>
      
      <section className="md:mb-3 mt-16 z-10 space-y-2">
        <h1 className="text-[#222435] text-3xl lg:text-6xl font-bold uppercase">
          Welcome to my {" "}
          <span className="text-fuchsia-600 italic">Aion</span>
        </h1>
        <h2 className="text-xl lg:text-3xl">
        Like what you see? Check out my{" "}
          <Link href="https://github.com/VansRouges" className="font-bold underline">
            Github
          </Link>
        </h2>
      </section>
      <Image
        className="mt-5 z-10 mb-10 cursor-pointer"
        src="https://gateway.pinata.cloud/ipfs/QmUkhu8offkiKmxUZrNb4bnvmCtrZ4k3WW5nn6DivGVyyN"
        alt="logo"
        width={450}
        height={450}
      />

      <Link
        href="https://twitter.com/VanceBillions"
        className="font-extrabold text-lg md:text-2xl text-black transition duration-200 
        hover:underline my-5 z-50"
      >
        Let's Connect on Twitter
        {/* <span className="font-extrabold underline decoration-fuchsia-600 text-fuchsia-600 transition duration-200">
          twitter.com/VanceBillions
        </span> */}
      </Link>


      <button
          onClick={logout}
          className="text-2xl uppercase font-bold mb-5 bg-[#C04ABC] text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200 mt-5"
      >
          logout
      </button>
    </div>
  )
}

export default Home;
