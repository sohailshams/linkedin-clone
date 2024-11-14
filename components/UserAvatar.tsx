import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserResource } from "@clerk/types";
import { User } from "@clerk/nextjs/server";
import { IUser } from "@/Types/AppUser";

type UserAvatarProps = {
  user: User | UserResource | null | undefined | IUser;
};

function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar>
      {user ? (
        <AvatarImage src={user?.imageUrl} />
      ) : (
        <AvatarImage src="https://github.com/shadcn.png" />
      )}
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
export default UserAvatar;
