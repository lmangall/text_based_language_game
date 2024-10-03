// components/UserPreferencesForm.tsx
import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Define a type for the interest to avoid implicit 'any'
type Interest = string;

export default function UserPreferencesForm() {
  const {
    name,
    setName,
    city,
    setCity,
    gender,
    setGender,
    targetLanguage,
    setTargetLanguage,
    languageLevel,
    setLanguageLevel,
    interests,
    setInterests,
    setPreferencesSet,
  } = useUserContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreferencesSet(true);
  };

  const handleInterestChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const interest = e.currentTarget.value;
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
    e.currentTarget.value = "";
  };

  const removeInterest = (interest: Interest) => {
    setInterests(interests.filter((i: Interest) => i !== interest)); // Explicitly typed 'i' as Interest
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender} required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="targetLanguage">Target Language</Label>
        <Select
          value={targetLanguage}
          onValueChange={setTargetLanguage}
          required
        >
          <option value="">Select language</option>
          <option value="FR">French</option>
          <option value="DE">German</option>
          <option value="ES">Spanish</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="languageLevel">Current Level</Label>
        <Select value={languageLevel} onValueChange={setLanguageLevel} required>
          <option value="">Select level</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="interests">Things you like</Label>
        <Input
          id="interests"
          placeholder="Add an interest and press Enter"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleInterestChange(e);
            }
          }}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {interests.map((interest: Interest, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              onClick={() => removeInterest(interest)}
            >
              {interest} ×
            </Badge>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">
        Save Preferences
      </Button>
    </form>
  );
}
