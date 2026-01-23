import type { Locale } from "./config";

export const translations = {
  fi: {
    hero: {
      h1: "OPEN TO WORK?",
      h1Sub: "Löytyykö Suomesta töitä 2026?",
      quote: "Olemme pelissä, jonka säännöt muuttuivat.",
      body: [
        'Moni on tehnyt kaiken "oikein".',
        "Opiskellut, kehittynyt ja sopeutunut jatkuvasti uusiin vaatimuksiin.",
        "",
        "Silti jokin ei loksahda paikoilleen.",
        "Ei siksi, että osaaminen puuttuisi, vaan siksi, että suunta puuttuu.",
        "",
        "Kukaan ei kertonut, että säännöt muuttuvat kesken pelin.",
        "Et ole yksin. Moni kokee saman.",
        "",
        "Vuosi 2026 ei vaadi sinulta uutta ammattia.",
        "Se vaatii kykyä ymmärtää, missä ja kenelle osaamisesi tuottaa arvoa.",
      ],
      cta: "Lue lisää",
    },
    markku: {
      eyebrow: "MARKKU TAURIAINEN",
      heading: "50 Years of Sales Mind — Now with AI",
      body: [
        "Olen nähnyt useita murroksia. Enemmän kuin useimmat ehtivät nähdä koko uransa aikana. Yksi asia ei ole muuttunut: Epäselvä ajattelu johtaa aina huonoihin päätöksiin.",
        "Liiketoiminta ei kaadu osaamisen puutteeseen, vaan siihen, että ihmiset yrittävät ratkaista vääriä ongelmia oikeilla taidoilla. Viime vuosina tekoäly on nopeuttanut tätä ilmiötä. Ei siksi, että teknologia korvaisi ihmisen, vaan siksi, että se paljastaa ajattelun heikkoudet armotta.",
        "Autan näkemään tilanteen sellaisena kuin se on ja ottamaan ensimmäisen järkevän askeleen eteenpäin.",
      ],
      bullets: [
        "Selkeys ennen toimintaa",
        "Kokemus, ei teoria",
        "Ensimmäinen konkreettinen askel",
      ],
      badges: {
        experience: "50+ Vuotta",
        ai: "AI Strategia",
        global: "50+ Maata",
      },
    },
    contact: {
      eyebrow: "YHTEYSTIEDOT",
      heading: "LIITY SÄHKÖPOSTILISTALLE",
      body: [
        "Jätä yhteystietosi. Saat ajatuksia ja oivalluksia myynnistä, liiketoiminnasta ja eteenpäin vievästä päätöksenteosta. Jos kirjoitukseni tai lyhyt-videoni ovat herättäneet ajatuksia ja kaipaat selkeyttä omiin askeliisi, voit liittyä sähköpostilistalle jättämällä yhteystietosi.",
        "",
        "En lähetä roskapostia. En myy tietojasi. Vastaan henkilökohtaisesti.",
      ],
      form: {
        firstName: "Etunimi",
        firstNamePlaceholder: "Etunimi",
        lastName: "Sukunimi",
        lastNamePlaceholder: "Sukunimi",
        email: "Sähköposti",
        emailPlaceholder: "nimi@esimerkki.fi",
        message: "Viesti",
        messageLabel: "Viesti (valinnainen)",
        messagePlaceholder: "Jos haluat, kerro lyhyesti tilanteestasi...",
        submit: "Lähetä",
        privacy: "Tietojasi käsitellään luottamuksellisesti.",
        errors: {
          firstNameRequired: "Etunimi on pakollinen tieto.",
          firstNameTooShort:
            "Etunimi on liian lyhyt. Vähintään 2 merkkiä vaaditaan.",
          firstNameTooLong:
            "Etunimi on liian pitkä. Enimmäispituus on 100 merkkiä.",
          lastNameRequired: "Sukunimi on pakollinen tieto.",
          lastNameTooShort:
            "Sukunimi on liian lyhyt. Vähintään 2 merkkiä vaaditaan.",
          lastNameTooLong:
            "Sukunimi on liian pitkä. Enimmäispituus on 100 merkkiä.",
          emailRequired: "Sähköpostiosoite on pakollinen tieto.",
          emailInvalid:
            "Tarkista sähköpostiosoitteen muoto. Esimerkki: nimi@esimerkki.fi",
          emailTooLong:
            "Sähköpostiosoite on liian pitkä. Enimmäispituus on 254 merkkiä.",
          messageTooLong:
            "Viesti on liian pitkä. Enimmäispituus on 5000 merkkiä.",
        },
      },
      success: "Olet listalla! Tarkista sähköpostisi.",
      successUpdated: "Tiedot päivitetty!",
      error: "Jokin meni vikaan. Yritä uudelleen.",
      errorValidation: "Tarkista tiedot ja yritä uudelleen.",
      errorNetwork: "Yhteysvirhe. Tarkista nettiyhteys.",
      errorServer: "Palvelinvirhe. Yritä myöhemmin.",
      errorConfigError: "Järjestelmä ei käytettävissä. Yritä myöhemmin.",
      errorUpdateFailed: "Päivitys epäonnistui. Yritä uudelleen.",
      errorBrevoError: "Tallennus epäonnistui. Yritä uudelleen.",
      errorUnknown: "Odottamaton virhe. Yritä uudelleen.",
    },
    footer: {
      copyright: "© 2026 Markku Tauriainen",
    },
    miniCourse: {
      hero: {
        eyebrow: "NOTEBOOK LLM EXPERIENCE",
        title: "Ajattelumalli vuodelle 2026",
        subtitle:
          "Ennen kuin opit mitään uutta, on ymmärrettävä miten ajattelet.",
        description:
          "Tekoälyajan toimintaympäristö vaatii ajattelun uudistamista.",
        ctaBack: "Palaa kotisivulle",
      },
      philosophy: {
        eyebrow: "SELKEYS ON UUSI KILPAILUETU",
        heading: "Passiivisesta reagoimisesta tietoiseen ajatteluun",
        body: [
          "Tietoa ei enää tarvitse etsiä.",
          "Sitä on liikaa.",
          "",
          "Mikä todella puuttuu?",
          "",
          "Useimmat lukevat, katsovat ja oppivat",
          "mutta eivät muuta mitään.",
          "Ajattelu pysyy reaktiivisena.",
          "",
          "Tässä ympäristössä tärkeintä ei ole se,",
          "mitä tiedät, vaan miten ajattelet ennen kuin toimit.",
          "",
          "Siksi tämä ei ala työkaluista.",
          "Eikä kompetenssista.",
          "Vaan ajattelusta.",
        ],
      },
      videoSection: {
        eyebrow: "3 LLM VIDEO EXPERIENCES",
        heading: "Ajattelu ratkaisee enemmän kuin kompetenssi ja työkalut",
      },
      videos: {
        customerFirst: {
          label: "LLM EXPERIENCE #1",
          title: "Asiakas ennen yritystä",
          duration: "8 minuuttia",
          description:
            "Miksi useimmat aloittavat väärästä päästä — ja miten kääntää ajattelusi ympäri.",
          reflection: "Kenen ongelmaa olet oikeasti ratkaisemassa?",
        },
        clarityFirst: {
          label: "LLM EXPERIENCE #2",
          title: "Selkeys ennen toimintaa",
          duration: "8 minuuttia",
          description:
            "Toiminta ilman suuntaa ei ole toimintaa. Tämä video auttaa sinua arvioimaan omat kivijalkasi.",
          reflection:
            "Mikä on yksi asia, jonka avaat yritit kuukauden tavoitteeksi?",
        },
        valueFirst: {
          label: "LLM EXPERIENCE #3",
          title: "Arvo ennen tuotetta",
          duration: "8 minuuttia",
          description:
            "Tuote on vain väline. Arvo on se, mistä ihmiset maksavat!",
          reflection: "Mitä asiakas oikeasti ostaa sinulta?",
        },
      },
      comparison: {
        eyebrow: "MIKSI TÄMÄ KOKEMUS?",
        heading: "Uusi ajatus, uusi kokemus",
        traditional: {
          label: "Perinteinen sisältö",
          items: ["Luetaan", "Listä", "Unohtuu"],
        },
        notebook: {
          label: "Notebook LLM",
          items: ["Älyn suodatin", "Koe", "Reflektoi"],
        },
      },
      clubHelios: {
        eyebrow: "CLUB HELIOS · FREQUENCY · PHOTON · LIGHT · SIGNAL",
        heading: "Mitä olen rakentamassa seuraavaksi",
        description: [
          "Rakennan parhaillaan {{Club Heliosta}}",
          "yksityistä AI-klubia, keskusta soveltavalle ajattelulle ja arvon luomiselle",
          "ihmisille, jotka eivät tarvitse lisää melua,",
          "vaan parempia päätöksiä.",
          "",
          "{{Club Helios}} on tila ajattelulle ja tekemiselle",
          "niille, jotka haluavat oppia hyödyntämään tekoälyä",
          "siellä missä sillä on todella merkitystä.",
        ],
        features: {
          title: "Sen ytimessä:",
          items: [
            {
              title: "Helios AI Hub",
              description:
                "Paikka soveltavalle ajattelulle — ei loputtomalle sisällölle.",
            },
            {
              title: "Helios AI Agents Library",
              description:
                "Käytännön agentit tukemaan todellista päätöksentekoa.",
            },
            {
              title: "Helios Local AI",
              description:
                "Niille, jotka arvostavat hallintaa, yksityisyyttä ja riippumattomuutta.",
            },
          ],
        },
        waitlist: [
          "Jos nämä ajatukset resonoivat,",
          "voit olla ensimmäisten joukossa liittymässä {{Club Heliokseen}},",
          "yksityiseen yhteisöön, jossa edelläkävijät",
          "oppivat hyödyntämään tekoälyä todellisen arvon luomiseen.",
          "",
          "Tämä on perustamisvaihe.",
          "Klubi ei ole vielä auki,",
          "ja sitä rakennetaan yhdessä niiden kanssa,",
          "jotka astuvat sisään nyt.",
        ],
      },
      stepIn: {
        heading: "Astu sisään",
        emailPlaceholder: "sahkoposti@esimerkki.fi",
        submit: "Liity perustajalistalle",
        privacy: "Ei maksua. Ei roskapostia. Henkilökohtainen vastaus.",
        success: "Olet Club Helios -listalla!",
      },
      videoComingSoon: "Coming soon",
      videoPublished: "Published",
      reflectionLabel: "REFLEKTIO",
      verifying: "Vahvistetaan pääsyä...",
      accessDenied: {
        title: "Pääsy estetty",
        message:
          "Tämä sisältö on vain tilaajille. Käytä tervetulosähköpostissa olevaa linkkiä.",
        goHome: "Siirry etusivulle",
      },
      error: {
        title: "Jokin meni vikaan",
        message: "Pääsyä ei voitu vahvistaa. Yritä myöhemmin uudelleen.",
      },
    },
  },
  en: {
    hero: {
      h1: "OPEN TO WORK?",
      h1Sub: "Europe 2026 is not playing by the old rules.",
      quote:
        "We are still in the game. But the rules changed while we were playing.",
      body: [
        "Many did everything right.",
        "Degrees. Skills. Adaptation. Continuous learning.",
        "",
        "And yet nothing clicks.",
        "Not because you lack competence.",
        "But because direction is missing.",
        "",
        "No one told you the rules would change mid-game.",
        "You are not alone. Across Europe, millions feel the same.",
        "",
        "2026 does not ask for a new profession.",
        "It asks whether you understand",
        "where and for whom your skills create value now.",
      ],
      cta: "Read more",
    },
    markku: {
      eyebrow: "MARKKU TAURIAINEN",
      heading: "50 Years of Sales Mind — Now with AI",
      body: [
        "I have lived through multiple economic shifts, more than most people experience in an entire career. One thing has never changed: Unclear thinking leads to bad decisions.",
        "Careers and businesses rarely fail because people lack skills. They fail because capable people try to solve the wrong problems with the right abilities. I have worked and negotiated across more than 50 countries. Different cultures. Different economies. Different rules of trust. I speak five languages fluently and operate comfortably across several others. This matters because value is cultural before it becomes commercial.",
        "AI has accelerated this shift. Not by replacing humans, but by exposing weak thinking without mercy. I help you see the situation as it truly is and take the first rational step forward.",
      ],
      bullets: [
        "Clarity before action",
        "Experience, not theory",
        "One concrete next step",
      ],
      badges: {
        experience: "50+ Years",
        ai: "AI Strategy",
        global: "50+ Countries",
      },
    },
    contact: {
      eyebrow: "CONTACT INFORMATION",
      heading: "JOIN THE EMAIL LIST",
      body: [
        "Leave your contact details. You'll receive reflections and insights on sales, value creation, and decision-making in a changing work landscape. If my writing or short videos have sparked thoughts and you feel you're missing clarity about your next step, you're welcome to join the email list by leaving your details here.",
        "",
        "I don't send spam. I don't sell your data. I reply personally.",
      ],
      form: {
        firstName: "First name",
        firstNamePlaceholder: "First name",
        lastName: "Last name",
        lastNamePlaceholder: "Last name",
        email: "Email",
        emailPlaceholder: "name@example.com",
        message: "Message",
        messageLabel: "Message (optional)",
        messagePlaceholder: "If you wish, briefly describe your situation...",
        submit: "Send",
        privacy: "Your data is handled confidentially.",
        errors: {
          firstNameRequired: "Please enter your first name.",
          firstNameTooShort:
            "First name is too short. At least 2 characters required.",
          firstNameTooLong:
            "First name is too long. Maximum 100 characters allowed.",
          lastNameRequired: "Please enter your last name.",
          lastNameTooShort:
            "Last name is too short. At least 2 characters required.",
          lastNameTooLong:
            "Last name is too long. Maximum 100 characters allowed.",
          emailRequired: "Please enter your email address.",
          emailInvalid:
            "Please enter a valid email address. Example: name@example.com",
          emailTooLong:
            "Email address is too long. Maximum 254 characters allowed.",
          messageTooLong:
            "Message is too long. Maximum 5000 characters allowed.",
        },
      },
      success: "You're on the list! Check your inbox.",
      successUpdated: "Info updated!",
      error: "Something went wrong. Please try again.",
      errorValidation: "Check your info and try again.",
      errorNetwork: "Connection error. Check your internet.",
      errorServer: "Server error. Try again later.",
      errorConfigError: "System unavailable. Try again later.",
      errorUpdateFailed: "Update failed. Please try again.",
      errorBrevoError: "Save failed. Please try again.",
      errorUnknown: "Unexpected error. Please try again.",
    },
    footer: {
      copyright: "© 2026 Markku Tauriainen",
    },
    miniCourse: {
      hero: {
        eyebrow: "NOTEBOOK LLM EXPERIENCE",
        title: "A Thinking Framework for 2026",
        subtitle:
          "Before you learn anything new, you need to understand how you think. This is the mindset required from now on.",
        description:
          "The current environment doesn't demand more skills. It demands a change in thinking.",
        ctaBack: "Explore the newsletter",
      },
      philosophy: {
        eyebrow: "CLARITY IS THE NEW COMPETITIVE ADVANTAGE",
        heading: "From passive reacting to conscious thinking",
        body: [
          "Information is no longer lacking.",
          "There's too much of it.",
          "",
          "What's missing is clarity.",
          "",
          "Most people read, watch, and learn",
          "but don't change anything.",
          "Thinking remains reactive.",
          "",
          "In this environment, what matters is not",
          "what you know, but how you think before you act.",
          "",
          "That's why this doesn't start with tools.",
          "Or competence.",
          "But with thinking.",
        ],
      },
      videoSection: {
        eyebrow: "3 LLM VIDEO EXPERIENCES",
        heading: "Thinking matters more than competence or tools",
      },
      videos: {
        customerFirst: {
          label: "LLM EXPERIENCE #1",
          title: "Customer before company",
          duration: "8 minutes",
          description:
            "Why most start from the wrong end — and how to turn your thinking around.",
          reflection: "Whose problem are you actually solving?",
        },
        clarityFirst: {
          label: "LLM EXPERIENCE #2",
          title: "Clarity before action",
          duration: "8 minutes",
          description:
            "Action without direction is just motion. This session helps you tell them apart.",
          reflection: "What is one thing you should stop doing?",
        },
        valueFirst: {
          label: "LLM EXPERIENCE #3",
          title: "Value before product",
          duration: "8 minutes",
          description:
            "The product is just a vehicle. Value is what people pay for.",
          reflection: "What is the customer really buying from you?",
        },
      },
      comparison: {
        eyebrow: "EXPERIENCE",
        heading: "Why this works",
        traditional: {
          label: "Traditional content",
          items: ["Download", "Read", "Forget"],
        },
        notebook: {
          label: "Notebook LLM",
          items: ["Dive in", "Experience", "Reflect"],
        },
      },
      clubHelios: {
        eyebrow: "CLUB HELIOS · FREQUENCY · PHOTON · LIGHT · SIGNAL",
        heading: "What I'm building next",
        description: [
          "I'm currently building {{Club Helios}}",
          "a private AI club, a hub for applied thinking and value creation",
          "for people who don't need more noise,",
          "but better decisions.",
          "",
          "{{Club Helios}} is a space for thinking and doing",
          "for those who want to learn how to leverage AI",
          "where it truly matters.",
        ],
        features: {
          title: "At its core:",
          items: [
            {
              title: "Helios AI Hub",
              description:
                "A place for applied thinking — not endless content.",
            },
            {
              title: "Helios AI Agents Library",
              description:
                "Practical agents to support real decision-making.",
            },
            {
              title: "Helios Local AI",
              description:
                "For those who value control, privacy, and independence.",
            },
          ],
        },
        waitlist: [
          "If these ideas resonate,",
          "you can be among the first to join {{Club Helios}},",
          "a private community where frontier thinkers",
          "learn to leverage AI for real value.",
          "",
          "This is the founding phase.",
          "The club isn't open yet,",
          "and it's being built together with those",
          "who step in now.",
        ],
      },
      stepIn: {
        heading: "Step in",
        emailPlaceholder: "name@example.com",
        submit: "Join Founding List",
        privacy: "No payment. No spam. Personal reply.",
        success: "You're on the Club Helios list!",
      },
      videoComingSoon: "Coming soon",
      videoPublished: "Published",
      reflectionLabel: "REFLECTION",
      verifying: "Verifying access...",
      accessDenied: {
        title: "Access Denied",
        message:
          "This content is only available to subscribers. Please use the link from your welcome email.",
        goHome: "Go to Homepage",
      },
      error: {
        title: "Something Went Wrong",
        message: "Unable to verify access. Please try again later.",
      },
    },
  },
} as const;

export function getTranslation(locale: Locale, key: string): string | string[] {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
