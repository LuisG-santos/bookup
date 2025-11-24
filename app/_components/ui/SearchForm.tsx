import { Input } from "./input";
import { Button } from "./button";
import { SearchIcon } from "lucide-react";
type SearchFormProps = {
   defaultValue?: string;
   placeholder?: string;
};

export const dynamic = "force-dynamic";


const SearchForm = async ({ defaultValue = "", placeholder }: SearchFormProps) => {
    

    
    return (
        <form method="GET">
            <div className="flex items-center gap-2 mt-6">
                <Input placeholder={placeholder} name="search" defaultValue={defaultValue} className="border border-solid border-zinc-700" />
                <Button type="submit" className="bg-zinc-100 hover:bg-zinc-300 focus:ring-2 focus:ring-slate-400 border-black" >
                    
                    <SearchIcon className="text-black" />

                </Button>
            </div>
        </form>
    );
}

export default SearchForm;