import { SearchIcon } from "lucide-react";
import Image from "next/image";

function Header() {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        alt="logo"
        className="rounded-lg"
        src="https://links.papareact.com/b3z"
        width={40}
        height={40}
      />

      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            className="bg-transparent flex-1 outline-none"
            type="text"
            placeholder="Search"
          />
        </form>
      </div>
    </div>
  );
}
export default Header;
