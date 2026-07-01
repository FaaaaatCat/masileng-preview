export default function ProfileAvatar({ user, size = 40 }) {
  const bg = user?.profileBg || "#FFB3C6";
  const imgKey = user?.profileImg || "profile_img";

  return (
    <div
      className="profile-avatar-wrap"
      style={{ width: size, height: size, background: bg }}
    >
      <img src={`/character_illust/profile_img/${imgKey}.png`} alt="프로필" />
    </div>
  );
}
