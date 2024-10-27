import Image from "next/image";

function Header() {
  return (
    <div className="flex ">
      <Image
        alt="logo"
        className="rounded-lg"
        src="https://links.papareact.com/b3z"
        width={40}
        height={40}
      />
    </div>
  );
}
export default Header;
