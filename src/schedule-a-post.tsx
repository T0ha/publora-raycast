import { Form, ActionPanel, Action, showToast, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";

import { Post, Platform } from "./types";
import { fetchPlatforms, schedulePost } from "./api";

export default function Command() {
  function handleSubmit(post: Post) {
    console.log(post);
    schedulePost(api_key, post);
    showToast({ title: "Submitted form", message: "See logs for submitted values" });
  }

  const api_key = getPreferenceValues<{ api_key: string }>().api_key;

  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      platformId: "loading",
      username: "loading",
      displayName: "Loading...",
      profileImageUrl: "",
    },
  ]);

  useEffect(() => {
    const getPlatforms = async () => {
      try {
        const platforms = await fetchPlatforms(api_key);
        setPlatforms(platforms);
      } catch (error) {
        console.error("Error fetching platforms:", error);
        showToast({ title: "Error", message: "Failed to fetch platforms" });
      }
    };

    getPlatforms();
  }, [api_key]);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Schedule a post in Publora" />

      <Form.DatePicker id="scheduledTime" title="Schedule" type={Form.DatePicker.Type.DateTime} />
      <Form.TagPicker id="platforms" title="Publish to">
        {platforms.map((platform) => (
          <Form.TagPicker.Item
            key={platform.platformId}
            value={platform.platformId}
            title={platform.platformId.split("-")[0]}
            icon={{ source: platform.profileImageUrl, mask: "circle" }}
          />
        ))}
      </Form.TagPicker>
      <Form.Separator />
      <Form.TextArea id="content" title="Post" placeholder="Your post here" />
    </Form>
  );
}
