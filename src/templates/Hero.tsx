import { Background } from '../background/Background';
import { Section } from '../layout/Section';
import { MoreInfo } from './MoreInfo';
import { InputTable } from './Table';

const Hero = () => (
  <Background color="bg-blue-50">
    {/* <Section yPadding="py-6"> */}
    {/* <NavbarTwoColumns logo={<Logo xl />}> */}
    {/* <li>
          <Link href="https://github.com/ixartz/Next-JS-Landing-Page-Starter-Template">
            <a>GitHub</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>Sign in</a>
          </Link>
        </li> */}
    {/* </NavbarTwoColumns> */}
    {/* </Section> */}

    <Section yPadding="px-0 pb-32 mw-100">
      <InputTable />
      <MoreInfo />
      {/* <HeroOneButton
        title={
          <>
            {'The modern landing page for\n'}
            <span className="text-primary-500">React developers</span>
          </>
        }
        description="The easiest way to build a React landing page in seconds."
        button={
          <Link href="https://creativedesignsguru.com/category/nextjs/">
            <a>
              <Button xl>Download Your Free Theme</Button>
            </a>
          </Link>
        }
      /> */}
    </Section>
  </Background>
);

export { Hero };
