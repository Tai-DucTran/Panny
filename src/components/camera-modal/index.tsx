// src/components/add-plant-form/camera-modal.tsx
import React, { useState } from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  ComingSoonTitle,
  ComingSoonText,
  FeatureImage,
  SubscribeForm,
  SubscribeInput,
  SubscribeButton,
  SuccessMessage,
} from "./index.sc";
import Image from "next/image";

interface CameraModalProps {
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Plant Health Analysis</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalContent>
          <FeatureImage>
            <Image
              src="/images/plants/normal-plants/plant-1.jpg"
              alt="Plant Health Analysis"
              width={400}
              height={200}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                opacity: "0.8",
              }}
            />
            <ComingSoonTitle>Coming Soon!</ComingSoonTitle>
          </FeatureImage>

          <ComingSoonText>
            Our AI-powered plant health analysis feature is currently under
            development. Snap a photo of your plant, and our AI will diagnose
            issues and provide tailored care recommendations.
          </ComingSoonText>

          {isSubscribed ? (
            <SuccessMessage>
              {`Thanks for subscribing! We'll notify you when the plant health
              analysis feature is available.`}
            </SuccessMessage>
          ) : (
            <SubscribeForm onSubmit={handleSubmit}>
              <SubscribeInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <SubscribeButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Get Notified"}
              </SubscribeButton>
            </SubscribeForm>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CameraModal;
