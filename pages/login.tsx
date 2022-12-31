import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react"
import {
    useClaimNFT,
    useLogin,
    useLogout,
    useProgram,
    useUser,
    useDropUnclaimedSupply,
    useNFTs,
} from "@thirdweb-dev/react/solana"
import { wallet } from "./_app"
import Router, { useRouter } from "next/router"
import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import Image from "next/image";

function LoginPage() {
    const [usersNft, setUsersNft] = useState<NFT | undefined>();
    const login = useLogin();
    const logout = useLogout();
    const router = useRouter();
    const { user } = useUser();
    const { publicKey, connect, select } = useWallet();

    const { program } = useProgram(
        process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
        "nft-drop"
    );

    const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
    const { data: nfts, isLoading } = useNFTs(program);
    const { mutateAsync: claim } = useClaimNFT(program);

    useEffect(() => {
        if(!publicKey){
            select(wallet.name);
            connect();
        }
    }, [publicKey, wallet]);

    useEffect(() => {
        if(!user || !nfts) return;

        const usersNft = nfts.find((nft) => nft.owner === user?.address);

        if(usersNft){
            setUsersNft(usersNft);
        }
    }, [nfts, user]);

    const handleLogin = async () => {
        await login();
        router.replace('/');
    };

    const handlePurchase = async () => {
        await claim({
            amount: 1,
        });
        router.replace("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#368163]">
            <div className="absolute top-56 left-0 w-full h-[20%] bg-[#2c2f47] -skew-y-12 z-10 overflow-hidden shadow-xl" />
            <div className="absolute top-56 right-0 w-full h-[20%] bg-[#2d3047] skew-y-12 z-10 overflow-hidden shadow-xl" />

            <Image
                className="mt-12 z-30 mb-5 rounded-full"
                src="https://gateway.pinata.cloud/ipfs/QmYGRVjikCMXi9d9H4tZytNMEFRFqBPsbzc2isQoRbfAAJ"
                alt="logo"
                width={370}
                height={370}
            />


            <main className="z-30 text-white">
                <h1 className="text-4xl font-bold uppercase">
                    Welcome to   <br />
                    <span className="text-[#2d3045]">
                        Planet Vance
                    </span>
                </h1>

                {!user && (
                    <div>
                        <button
                            onClick={handleLogin}
                            className="text-2xl font-bold mb-5 bg-[#C04ABC] text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200 mt-5"
                        >
                            Login / Connect Wallet
                        </button>
                    </div>
                )}

                {user && (
                    <div>
                        <p className="text-lg text-[#C04ABC] font-bold mb-10">
                            Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
                        </p>

                        {isLoading && (
                            <div className="text-2xl font-bold mb-5 bg-[#C04ABC] text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200">
                                Hold on, We're just looking for your Ocean 8 Membership pass...
                            </div>
                        )}

                        {usersNft && (
                            <Link
                                href="/"
                                className="text-2xl font-bold mb-5 bg-[#C04ABC] text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-fuchsia-600 mt-5 uppercase"
                            >
                                ACCESS GRANTED - ENTER
                            </Link>
                        )}

                        {!usersNft &&
                            !isLoading &&
                            (unclaimedSupply && unclaimedSupply > 0 ? (
                                <button onClick={handlePurchase} className="bg-[#C04ABC] text-white py-4 px-10 border-2 border-[#C04ABC] rounded-md hover:bg-white hover:text-fuchsia-600 mt-5 uppercase font-bold transition duration-200">
                                    Buy an Ocean 8 Membership Pass
                                </button>
                            ) : (
                                <p className="text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200">
                                    Sorry, we're all out of Ocean 8 Mmebership passes! Better luck next time!
                                </p>
                            ))}
                    </div>
                )}

                {user && (
                    <button
                        onClick={logout}
                        className="bg-white text-fuchsia-600 py-4 px-10 border-2 border-[#C04ABC] rounded-md hover:bg-fuchsia-600 hover:text-white mt-10 uppercase font-bold transition duration-200">
                            logout
                        </button>
                )}
            </main>
        </div>
    )
}

export default LoginPage;