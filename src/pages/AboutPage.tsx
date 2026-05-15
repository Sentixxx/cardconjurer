import type { JSX } from 'react';

export function AboutPage(): JSX.Element {
  return (
    <>
      <h2 className="readable-background header-extension title center">About Me</h2>
      <div className="layer center" />
      <div className="layer center">
        <h1>Hello!</h1>
        <h4>It&apos;s me, Kyle &#x1F440;</h4>
      </div>
      <div className="layer center" />
      <div className="layer readable-background margin-bottom-large">
        <h4 className="padding">
          I&apos;m the creator of Card Conjurer. I started playing Magic with an M14 deckbuilder&apos;s toolkit. I played 60-card casual games with several close friends, and when Khans of Tarkir was released we attended our first prerelease. As the years passed I got more and more into Magic and ultimately discovered Commander, which is the format I currently play.
        </h4>
      </div>
      <div className="layer readable-background margin-bottom-large">
        <h4 className="padding">
          During middle school I did some light programming with Processing and Lego&apos;s NXT/EV3, and halfway through high school I taught myself Javascript, HTML, and CSS (the languages that compose websites). Then, in the summer of 2018, I combined my love for Magic and curiosity for programming by creating Card Conjurer.
        </h4>
      </div>
      <div className="layer readable-background margin-bottom-large">
        <h4 className="padding">
          I initially wanted to make some Commander Achievement cards that looked like real Magic cards, so I decided to make a small web-based application to fill blank magic card images with text and mana symbols. It worked surprisingly well, and I soon began to expand on the original idea by adding more customization and more frames. By the end of summer break I decided to purchase the domain CardConjurer.com so I could share my program with the world. Since then I&apos;ve remade the entire website from the ground-up four times, and am very pleased with its current state. While I don&apos;t plan on any major revisions, I will continue adding new frames and features.
        </h4>
      </div>
      <div className="layer readable-background margin-bottom-large">
        <h4 className="padding">
          I graduated from high school in 2020, and because I had such a great time learning to code and discovering how much it could accomplish I decided to pursue programming. As of Fall of 2020, I&apos;ve been attending CalPoly SLO majoring in Software Engineering.
        </h4>
      </div>
      <div className="layer readable-background margin-bottom-large">
        <h4 className="padding">
          Whether you&apos;d like to see what I&apos;m up to in the Magic world or take a look at some of the cards I&apos;ve made with Card Conjurer, please consider taking a moment to check out my Twitter{' '}
          <a style={{ color: '#00aced' }} href="https://twitter.com/ImKyle4815" target="_blank" rel="noreferrer">
            @ImKyle4815
          </a>
          !
        </h4>
      </div>
    </>
  );
}
