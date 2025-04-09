"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";

export interface ServiceItemProps {
  title: string;
  description?: string;
}

const ServiceItem = ({ title, description }: ServiceItemProps) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold uppercase mb-2">{title}</h3>
    <p className="text-zinc-300">{description}</p>
  </div>
);

export interface ServicesModalProps {
  trigger: React.ReactNode;
}

export default function ServicesModal({ trigger }: ServicesModalProps) {
  const services = [
    {
      title: "Web Development",
      description:
        "Full-stack web applications with modern frameworks and technologies.",
    },
    {
      title: "Frontend Development",
      description:
        "Responsive, accessible, and performant user interfaces with React, Next.js, and more.",
    },
    {
      title: "SEO Optimization",
      description:
        "Improve your site's visibility and ranking through technical SEO and content optimization.",
    },
  ];

  return (
    <Modal>
      <ModalTrigger className="bg-transparent border-none p-0 m-0 cursor-pointer w-auto inline-block">
        {trigger}
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <div className="mb-8 mx-auto">
            <h2 className="text-3xl md:text-4xl text-grey-300 font-bold uppercase mb-6 text-left">
              Services
            </h2>
            <div className="space-y-8 text-grey-400">
              {services.map((service, index) => (
                <ServiceItem key={index} title={service.title} />
              ))}
            </div>
          </div>
          <div className="mx-auto">
            <button
              onClick={() =>
                document
                  .getElementById("sayhi")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-grey-400 px-2 py-2 border text-left rounded-3xl border-white font-light hover:bg-grey-300 transition-colors"
            >
              Contact Me
            </button>
          </div>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
