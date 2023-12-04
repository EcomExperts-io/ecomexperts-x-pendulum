import {
  Checkbox,
  reactExtension,
  useDeliveryGroups,
  useBuyerJourneyIntercept,
  useExtensionCapability
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);


function Extension() {

  const deliveryGroups = useDeliveryGroups()
 
const canBlockProgress = useExtensionCapability("block_progress");
  const SelectedDelivery = deliveryGroups[0].deliveryOptions.filter(({handle})=>handle == deliveryGroups[0].selectedDeliveryOption.handle)
  console.log(SelectedDelivery)
  console.log( SelectedDelivery[0].title === "International Economy" ? true : false)
  const [error, setError] = useState("")

    useBuyerJourneyIntercept(
    ({canBlockProgress}) => {
      return canBlockProgress 
        ? {
            behavior: 'block',
            reason: 'Invalid shipping country',
            errors: [
              {
                message:
                  'Sorry, we can only ship to Canada',
                // Show an error underneath the country code field
                target:
                  '$.cart.deliveryGroups[0].deliveryAddress.countryCode',
              },
              {
                // In addition, show an error at the page level
                message:
                  'Please use a different address.',
              },
            ],
          }
        : {
            behavior: 'allow',
          };
    },
  );
 
  return (
    SelectedDelivery[0].title === "International Economy" ?
    <Checkbox 
    id="shipping-consent" 
    name="ShippingConsent"
    error={error}
    onChange={(value)=>{
      value ? setError("") : setError("To continue with your purchase, agree to the international shipping terms.")
    }}  
    >
      I understand that this item is non-refundable, that the customer is responsible for any customs fees and clearance, and that Pendulum will not be able to track the package once it departs from the U.S.    
    </Checkbox> :
    null
  );

}