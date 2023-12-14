import {
  Checkbox,
  reactExtension,
  useBuyerJourneyIntercept,
  useExtensionCapability,
  useApplyNoteChange,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

const errorText =
  "To continue with your purchase, agree to the deferred or recurring purchase terms.";
const consentText =
  "I understand that I'm agreeing to a subscription. It will renew at the price and frequency listed until it ends or is cancelled.";

function Extension() {
  const [isSubscription, setSubscription] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setChecked] = useState(false);
  const cartLines = useCartLines();
  const noteChange = useApplyNoteChange();

  //Check if cart has subscription product
  useEffect(() => {
    for (const item of cartLines) {
      const subtitle = item.merchandise.subtitle;

      if (subtitle && subtitle.includes("Membership")) {
        setSubscription(true);
        break;
      }
    }
  }, []);

  //block progress if consent not provided
  const canBlockProgress = useExtensionCapability("block_progress");
  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the consent
    if (canBlockProgress && !isChecked) {
      return {
        behavior: "block",
        reason: errorText,
        perform: (result) => {
          if (result.behavior === "block") {
            setError(errorText);
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        setError("");
      },
    };
  });

  //if consent given, by selecting checkbox then add note for order else set show error
  const handleChange = async (value) => {
    setChecked(value);
    value ? setError("") : setError(errorText);

    if (value) {
      try {
        let fecha = new Date(
          new Date().toLocaleString("en", { timeZone: "America/Los_Angeles" })
        );
        let formattedFecha = fecha.toString().split("GMT")[0];

        const result = await noteChange({
          type: "updateNote",
          note: `One or more of the items in your cart is a membership purchase. By continuing, I agree to the cancellation policy and authorize you to charge my payment method at the prices, frequency and dates listed on this page until my order is fulfilled or I cancel, if permitted. -- Timestamp ${formattedFecha} `,
        });
      } catch (err) {
        console.log("err", error);
      }
    }
  };

  //if cart includes any subscription product then show consent checkbox 
  return isSubscription ? (
    <Checkbox
      id="subscription-product-consent"
      name="SubscriptionProductConsent"
      checked={isChecked}
      error={error}
      required={canBlockProgress}
      onChange={handleChange}
    >
      {consentText}
    </Checkbox>
  ) : null;
}
