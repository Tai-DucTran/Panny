// src/components/task-list/subscription-container.tsx
import React, { useState } from "react";
import {
  SubscriptionWrapper,
  SubscriptionTitle,
  SubscriptionSubtitle,
  SubscriptionForm,
  SubscriptionInput,
  SubscriptionButton,
} from "./subscription-container.sc";

const SubscriptionContainer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail("");

      // Reset subscription state after showing success message
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <SubscriptionWrapper>
      <SubscriptionTitle>
        Never miss a watering day with email reminders
      </SubscriptionTitle>
      <SubscriptionSubtitle>
        {`We'll also share expert care tips and Panny updates`}
      </SubscriptionSubtitle>
      <SubscriptionForm onSubmit={handleSubmit}>
        <SubscriptionInput
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting || subscribed}
        />
        <SubscriptionButton type="submit" disabled={isSubmitting || subscribed}>
          {subscribed
            ? "Subscribed!"
            : isSubmitting
            ? "Subscribing..."
            : "Get Reminders"}
        </SubscriptionButton>
      </SubscriptionForm>
    </SubscriptionWrapper>
  );
};

export default SubscriptionContainer;
