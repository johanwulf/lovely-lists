import CreateList from "@/components/create-list";
import Lists from "@/components/lists";

export default function IndexPage() {
    return (
        <section className="container max-w-lg grid items-center gap-6 pb-8 pt-6 md:py-10">
            <Lists />
            <CreateList />
        </section>
    );
}
