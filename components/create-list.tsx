import Link from "next/link";
import { Plus } from "lucide-react";

const CreateList = () => {
    return (
        <Link className="border border-2 rounded-full p-4 fixed right-6 bottom-6 bg-background" href="/create-new">
            <Plus />
        </Link>
    );
};

export default CreateList;
