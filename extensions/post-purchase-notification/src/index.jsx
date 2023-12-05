/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */
import React from 'react';

import {
  extend,
  render,
  Banner,
} from "@shopify/post-purchase-ui-extensions-react";

/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
 extend("Checkout::PostPurchase::ShouldRender", async ({ storage }) => {
  const initialState = await getRenderData();
  const render = true;
  
  if (render) {
    // Saves initial state, provided to `Render` via `storage.initialData`
    await storage.update(initialState);
  }

  return {
    render,
  };
});

// Simulate results of network call, etc.
async function getRenderData() {
  return {
      couldBe: "anything",
  };
}

/**
* Entry point for the `Render` Extension Point
*
* Returns markup composed of remote UI components.  The Render extension can
* optionally make use of data stored during `ShouldRender` extension point to
* expedite time-to-first-meaningful-paint.
*/
render("Checkout::PostPurchase::Render", App);

// Top-level React component
export function App({ extensionPoint, storage }) {

  const initialState = storage.initialData;
  const notificationText = "We are transitioning to a new operations system, so apologies if you receive duplicative shipment notifications from the team. You can reach out to our Customer Care team any time if there is any confusion."
  const show_post_purchase_notification = true;
  
 
  return (
    show_post_purchase_notification ?
    <Banner
    status="critical"
    title={notificationText}
    />:
    null
  );
}