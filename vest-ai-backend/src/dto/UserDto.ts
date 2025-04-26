export interface UserProfileDTO {
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  preference: {
    gender: string;
    dressingStyle: string[];
    preferredColors: string[];
    clothingSize: string;
    fitPreference: string;
    age?: number;
    ethnicity?: string;
    hasObesity?: boolean;
    salaryRange?: number;
    hobbies?: string[];
  };
}
