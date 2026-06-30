export default function ProfileAvatar({ user, size = 40 }) {
  const bg = user?.profileBg || "#FFB3C6";
  const imgKey = user?.profileImg || "profile_img";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={`/character_illust/profile_img/${imgKey}.png`}
        alt="프로필"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
