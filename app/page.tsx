"use client";

import CreateList from "@/components/create-list";
import Lists from "@/components/lists";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function IndexPage() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <section className="container max-w-lg grid items-center gap-6 pb-8 pt-6 md:py-10">
            {user ? (
                <>
                    {user.name}
                    {user.email}
                    <a href="/api/auth/logout">Logout</a>
                    <Lists />
                    <CreateList />
                </>
            ) : (
                <a href="/api/auth/login">Login</a>
            )}
        </section>
    );
}
