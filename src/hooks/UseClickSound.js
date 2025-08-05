export default function useClickSound() {
  const playClick = () => {
    const audio = new Audio('./click.mp3');
    audio.play();
  };

  return playClick;
}
