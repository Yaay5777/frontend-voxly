export interface Voice {
  id: string;
  name: string;
  gender: string;
  language: string;
  flag?: string; // Made optional as it might not exist on all voice objects
  // Add other voice properties as needed
  age?: string;
  description?: string;
  preview_url?: string;
  tags?: string[];
  category?: string;
  // Add any other properties that might be used with Voice objects
}
