"use client";
import { lazy, Suspense } from "react";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { FileSearchOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Space } from "antd";
import { createStyles } from "antd-style";

// Dynamically import animation and header components with error handling
const TextPressure = lazy(() =>
  import("../TextAnimations/TextPressure/TextPressure.jsx").catch(() => ({
    default: () => <span>ResumiFy</span>
  }))
);
const BlurText = lazy(() =>
  import("../TextAnimations/BlurText/BlurText.jsx").catch(() => ({
    default: ({ text }) => <span>{text}</span>
  }))
);
const TrueFocus = lazy(() =>
  import("../TextAnimations/TrueFocus/TrueFocus.jsx").catch(() => ({
    default: ({ sentence }) => <span>{sentence}</span>
  }))
);
const Header = lazy(() => 
  import("./Header.jsx").catch(() => ({
    default: () => null
  }))
);

const features = [
  {
    name: "Instant Resume Analysis",
    description:
      "Upload your resume and receive real-time feedback powered by AI. Get detailed scores, reviews, and personalized improvement tips.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Smart Job Matching",
    description:
      "Our AI-powered system automatically matches your resume with relevant job postings based on skills and experience.",
    icon: FingerPrintIcon,
  },
  {
    name: "Recruitment Platform",
    description:
      "Post jobs, find perfect candidates, and manage your hiring process all in one place. Get detailed candidate insights and matching scores.",
    icon: ArrowPathIcon,
  },
  {
    name: "Secure and Private",
    description:
      "Your data is safe with us. We use industry-standard security measures to protect your information.",
    icon: LockClosedIcon,
  },
];

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }
      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

export default function Home() {
  const { styles } = useStyle();

  return (
    <div className="bg-white">
      <Suspense fallback={<div>Loading header...</div>}>
        <Header />
      </Suspense>

      <div className="relative isolate px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              <Suspense fallback={<span>ResumiFy</span>}>
                <TextPressure
                  text="ResumiFy"
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="#000000"
                  strokeColor="#ff0000"
                  minFontSize={36}
                />
              </Suspense>
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              <Suspense fallback={<span>Loading text...</span>}>
                <BlurText
                  text="Your AI-powered recruitment and resume optimization platform."
                  delay={100}
                  animateBy="words"
                  direction="top"
                  className="text-2xl mb-8"
                />
              </Suspense>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/upload">
                <ConfigProvider
                  button={{
                    className: styles.linearGradientButton,
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      icon={<FileSearchOutlined />}
                    >
                      Upload Resume
                    </Button>
                  </Space>
                </ConfigProvider>
              </a>
              <a href="/jobpost">
                <ConfigProvider
                  button={{
                    className: styles.linearGradientButton,
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowPathIcon className="h-5 w-5" />}
                    >
                      Post a Job
                    </Button>
                  </Space>
                </ConfigProvider>
              </a>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-600">
              <Suspense fallback={<span>Stand Out. Get Hired.</span>}>
                <TrueFocus
                  sentence="Stand Out. Get Hired."
                  manualMode={false}
                  blurAmount={3}
                  borderColor="blue"
                  animationDuration={1}
                  pauseBetweenAnimations={0.2}
                />
              </Suspense>
            </h2>
            <br />
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
              Transform Your Recruitment Process with AI
            </p>
            <p className="mt-6 text-lg/8 text-gray-600">
              Whether you&apos;re a job seeker looking to optimize your resume or an employer seeking the perfect candidate, ResumiFy&apos;s AI-powered platform helps you achieve your goals faster and more effectively.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                      <feature.icon
                        aria-hidden="true"
                        className="size-6 text-white"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
