import * as React from 'react';
import { Link } from 'react-router-dom';

interface FooterGroup {
  name: string;
  links: FooterLink[];
}

interface FooterLink {
  title: string;
  url: string;
  brand?: boolean;
  icon: string;
}

const Footer: React.StatelessComponent = () => {
  const footerData: FooterGroup[] = [
    {
      name: '5 Calls',
      links: [
        {
          title: 'About Us',
          url: '/about-us/',
          icon: 'heart'
        },
        {
          title: 'Why Calling Works',
          url: '/why-calling-works/',
          icon: 'phone-alt'
        },
        {
          title: 'Topic Archives',
          url: '/archives/',
          icon: 'archive'
        },
        {
          title: 'Privacy',
          url: '/privacy/',
          icon: 'eye'
        }
      ]
    },
    {
      name: 'Support',
      links: [
        {
          title: 'Getting Started',
          url: '/getting-started/',
          icon: 'info-circle'
        },
        {
          title: 'Troubleshooting',
          url: '/troubleshooting/',
          icon: 'question-circle'
        },
        {
          title: 'Knowledge Base',
          url:
            'https://intercom.help/5calls/en/collections/1497141-using-the-5-calls-website-and-apps',
          icon: 'book-reader'
        },
        {
          title: 'Email Us',
          url: 'mailto:hello@5calls.org',
          icon: 'envelope-open-text'
        }
      ]
    },
    {
      name: 'Get Involved',
      links: [
        {
          title: 'Twitter',
          url: 'https://twitter.com/make5calls',
          brand: true,
          icon: 'twitter'
        },
        {
          title: 'Facebook',
          url: 'https://www.facebook.com/make5calls',
          brand: true,
          icon: 'facebook'
        },
        {
          title: 'Contribute on GitHub',
          url: 'https://github.com/5calls/5calls',
          brand: true,
          icon: 'github'
        },
        {
          title: 'Donate',
          url:
            'https://secure.actblue.com/contribute/page/5calls-donate?refcode=staticfooter',
          icon: 'money-bill-wave'
        }
      ]
    },
    {
      name: 'Account',
      links: [
        {
          title: 'Profile',
          url: '/profile',
          icon: 'user-circle'
        },
        {
          title: 'Your Impact',
          url: '/impact',
          icon: 'chart-line'
        },
        {
          title: 'Download for iOS',
          url:
            'https://apps.apple.com/us/app/5-calls-contact-your-congress/id1202558609',
          brand: true,
          icon: 'apple'
        },
        {
          title: 'Download for Android',
          url:
            'https://play.google.com/store/apps/details?id=org.a5calls.android.a5calls&hl=en_US',
          brand: true,
          icon: 'google-play'
        }
      ]
    }
  ];

  return (
    <div className="footer">
      <div className="content">
        <div className="footer-about">
          <p>
            <strong>© 2020 5 Calls Civic Action</strong>
          </p>
          <p>
            We are a 501(c)(4) non-profit that helps citizens make their voices
            heard.
          </p>
        </div>
        <div className="g g-4up">
          {footerData.map(group => (
            <div key={group.name}>
              <h4>{group.name}</h4>
              <ul>
                {group.links.map(link => (
                  <li key={link.url}>
                    <i
                      className={`fa${link.brand ? 'b' : ''} fa-fw fa-${
                        link.icon
                      }`}
                    />{' '}
                    {link.url.startsWith('http') ||
                    link.url.startsWith('mailto') ? (
                      <a href={link.url}>{link.title}</a>
                    ) : (
                      <Link to={link.url}>{link.title}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
