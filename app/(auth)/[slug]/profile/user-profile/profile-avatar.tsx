import Image from "next/image"

type ProfileAvatarProps = {
  userImage: string | undefined
  userName: string | undefined
  userEmail: string | undefined
}

export function ProfileAvatar({
  userImage,
  userName,
  userEmail,
}: ProfileAvatarProps) {
  if (userImage) {
    return (
      <Image
        src={userImage}
        alt="Profile Image"
        width={500}
        height={500}
        priority
        className="ring-primary size-32 rounded-full object-cover p-1 ring-4"
      />
    )
  }
  return (
    <div className="ring-primary grid size-32 place-items-center rounded-full ring-4">
      <h1 className="text-primary text-9xl font-bold capitalize">
        {userName ? userName.at(0) : userEmail && userEmail.at(0)}
      </h1>
    </div>
  )
}
