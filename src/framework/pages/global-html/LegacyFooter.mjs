import { h } from 'preact';
import { html } from '../../html.mjs';

const contactLinks = [
  { href: 'https://twitter.com/ImKyle4815', label: 'Twitter', target: '_blank' },
  { href: 'https://www.patreon.com/KyleBurton', label: 'Patreon', target: '_blank' },
  { href: 'mailto:cardconjurermtg@gmail.com', label: 'Email', target: '_blank' },
];

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/creator', label: 'Creator' },
  { href: '/print', label: 'Print' },
  { href: '/theme', label: 'Theme Editor' },
  { href: '/askurza', label: 'Ask Urza' },
  { href: '/phyrexian', label: 'Phyrexian Generator' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/theme', label: 'Theme Editor' },
];

function FooterLinkList({ title, links }) {
  return html`
    <div>
      <h4>${title}</h4>
      ${links.map((link) => h('h5', null, h('a', {
        href: link.href,
        ...(link.target ? { target: link.target } : {}),
      }, link.label)))}
    </div>
  `;
}

export function DormantLegacyFooter() {
  return html`
    <footer class="readable-background">
      <${FooterLinkList} title="Card Conjurer" links=${contactLinks} />
      <${FooterLinkList} title="Navigation" links=${navigationLinks} />
      <div>
        <h4>Legal</h4>
        <h5><a href="/legal">Terms and Conditions</a></h5>
        <p>
          We are neither affiliated with, sponsored by, nor endorsed by Wizards of the Coast.
          Fonts, Mana symbols, card images, and other related images are trademarks and
          copyrights of Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc.<br />
          We are neither affiliated with, sponsored by, nor endorsed by Legend Story Studios.
          Fonts, icons, card images, and other related images are trademarks and copyrights
          of Legend Story Studios.<br />
          We are neither affiliated with, sponsored by, nor endorsed by Scryfall LLC.<br />
          All user-uploaded material is property of the original artist, and it is the user's
          responsibility to ensure that these materials are properly credited.<br />
          All other content Copyright ©
          <script dangerouslySetInnerHTML=${{ __html: ' document.write(new Date().toLocaleDateString()); ' }}></script>
          Card Conjurer.<br />
          For more information on the Disclaimer or Terms and Conditions, please click the link above.
        </p>
      </div>
    </footer>
  `;
}
