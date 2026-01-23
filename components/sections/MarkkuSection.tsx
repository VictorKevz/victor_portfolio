import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { MarkkuSection as MarkkuSectionData } from "@/lib/wordpress/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface MarkkuSectionProps {
  data: MarkkuSectionData;
}

export default function MarkkuSection({ data }: MarkkuSectionProps) {
  const descriptions = [
    data.markku_section_descriptions?.description_1,
    data.markku_section_descriptions?.description_2,
    data.markku_section_descriptions?.description_3,
  ].filter((desc): desc is string => Boolean(desc));

  // Extract features from root level
  const features = [
    data.features?.feature_1,
    data.features?.feature_2,
    data.features?.feature_3,
  ]
    .filter((feature): feature is string => 
      Boolean(feature && typeof feature === 'string' && feature.trim().length > 0)
    );

  return (
    <section
      id="markku-section"
      className="w-full flex items-center justify-center py-12 sm:py-16 "
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <figure className="w-full h-full">
            <VideoPlayer
              src={data.markku_welcome_video || ''}
              poster="/markkutauriainen_profile.webp"
              alt="Markku Tauriainen, sales professional with 50 years of experience"
            />
          </figure>

          {/* Text Column */}
          <div className="w-full text-left md:text-center lg:text-left flex flex-col justify-center">
            {data.author && (
              <p className="text-subtle text-sm uppercase tracking-wider font-medium py-4!">
                {data.author}
              </p>
            )}

            {data.title && (
              <h2 className="uppercase text-2xl text-left md:text-center lg:text-left sm:text-3xl lg:text-4xl lg:max-w-2xl font-semibold text-hero leading-tight mb-4!">
                {data.title}
              </h2>
            )}

            <div className="text-left md:text-center lg:text-left space-y-4 sm:space-y-5">
              {descriptions.map((paragraph, index) => (
                <p
                  key={index}
                  className="py-2! text-body text-left md:text-center lg:text-left text-base sm:text-lg lg:text-xl leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="w-full flex flex-col md:flex-row justify-center lg:justify-between items-start md:items-center gap-2 mt-4!">
              {features.map((bullet, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm gap-1"
                >
                  <span className="text-(--background) rounded-full bg-(--accent-warm) flex items-center justify-center text-lg font-bold mt-0 shrink-0">
                    <CheckCircleIcon className="w-4 h-4 text-(--background)" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
