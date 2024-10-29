import { Button } from "@/components/ui/button";
import UserInformation from "@/components/UserInformation";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid">
      <section>
        <UserInformation />
      </section>

      <section>
        {/* postfrom */}
        {/* post feed */}
      </section>

      <section>{/* widget */}</section>
    </div>
  );
}
