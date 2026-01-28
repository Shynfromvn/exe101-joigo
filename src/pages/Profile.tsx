import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n_temp";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { language } = useTours();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    birthdate: user?.birthdate ? new Date(user.birthdate) : undefined,
    city: user?.city || "",
    mobileNumber: user?.mobileNumber || "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
        city: user.city || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    try {
      updateUser({
        name: formData.name,
        gender: formData.gender as "male" | "female" | "other" | undefined,
        birthdate: formData.birthdate
          ? formData.birthdate.toISOString().split("T")[0]
          : undefined,
        city: formData.city,
        mobileNumber: formData.mobileNumber,
      });
      setIsEditing(false);
      toast({
        title: t(language, "profile_update_success"),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t(language, "profile_update_error"),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
        city: user.city || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
    setIsEditing(false);
  };

  const handleAddMobile = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {t(language, "profile_user_info")}
                </CardTitle>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    {t(language, "profile_not_logged_in")}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {user ? (
                <>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="flex gap-2 items-start">
                        <Label className="text-muted-foreground w-40 pt-2">
                          {t(language, "profile_full_name")}
                        </Label>
                        <span className="font-medium pt-2">{user.name}</span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Label className="text-muted-foreground w-40 pt-2">
                          {t(language, "profile_email")}
                        </Label>
                        <span className="font-medium pt-2">{user.email}</span>
                      </div>
                      {user.gender && (
                        <div className="flex gap-2 items-start">
                          <Label className="text-muted-foreground w-40 pt-2">
                            {t(language, "profile_gender")}
                          </Label>
                          <span className="font-medium pt-2">
                            {user.gender === "male"
                              ? t(language, "profile_male")
                              : user.gender === "female"
                              ? t(language, "profile_female")
                              : t(language, "profile_other")}
                          </span>
                        </div>
                      )}
                      {user.birthdate && (
                        <div className="flex gap-2 items-start">
                          <Label className="text-muted-foreground w-40 pt-2">
                            {t(language, "profile_birthdate")}
                          </Label>
                          <span className="font-medium pt-2">
                            {format(new Date(user.birthdate), "PPP")}
                          </span>
                        </div>
                      )}
                      {user.city && (
                        <div className="flex gap-2 items-start">
                          <Label className="text-muted-foreground w-40 pt-2">
                            {t(language, "profile_city")}
                          </Label>
                          <span className="font-medium pt-2">{user.city}</span>
                        </div>
                      )}
                      {user.mobileNumber ? (
                        <div className="flex gap-2 items-start">
                          <Label className="text-muted-foreground w-40 pt-2">
                            {t(language, "profile_mobile")}
                          </Label>
                          <span className="font-medium pt-2">
                            {user.mobileNumber}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start">
                          <Label className="text-muted-foreground w-40 pt-2">
                            {t(language, "profile_mobile")}
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddMobile}
                          >
                            {t(language, "profile_add_mobile")}
                          </Button>
                        </div>
                      )}
                      <div className="pt-4">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          {t(language, "profile_edit")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">
                          {t(language, "profile_full_name")}
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>{t(language, "profile_email")}</Label>
                        <Input
                          value={user.email}
                          disabled
                          className="mt-1 bg-muted"
                        />
                      </div>
                      <div>
                        <Label>{t(language, "profile_gender")}</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gender: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue
                              placeholder={t(language, "profile_select_gender")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">
                              {t(language, "profile_male")}
                            </SelectItem>
                            <SelectItem value="female">
                              {t(language, "profile_female")}
                            </SelectItem>
                            <SelectItem value="other">
                              {t(language, "profile_other")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t(language, "profile_birthdate")}</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {/* Year Select */}
                          <Select
                            value={
                              formData.birthdate
                                ? formData.birthdate.getFullYear().toString()
                                : ""
                            }
                            onValueChange={(year) => {
                              const currentDate = formData.birthdate;
                              const selectedYear = parseInt(year);
                              const month = currentDate
                                ? currentDate.getMonth()
                                : 0; // Default to January
                              const day = currentDate
                                ? Math.min(
                                    currentDate.getDate(),
                                    new Date(
                                      selectedYear,
                                      month + 1,
                                      0
                                    ).getDate()
                                  )
                                : 1; // Default to day 1
                              const newDate = new Date(
                                selectedYear,
                                month,
                                day
                              );
                              setFormData({
                                ...formData,
                                birthdate: newDate,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={language === "VI" ? "Năm" : "Year"}
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {/* Month Select */}
                          <Select
                            value={
                              formData.birthdate
                                ? (formData.birthdate.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0")
                                : ""
                            }
                            onValueChange={(month) => {
                              const currentDate = formData.birthdate;
                              const selectedMonth = parseInt(month) - 1;
                              // Use current year if no date set, otherwise use selected year
                              const year = currentDate
                                ? currentDate.getFullYear()
                                : new Date().getFullYear();
                              // Ensure day is valid for the selected month
                              const maxDays = new Date(
                                year,
                                selectedMonth + 1,
                                0
                              ).getDate();
                              const day = currentDate
                                ? Math.min(currentDate.getDate(), maxDays)
                                : 1;
                              const newDate = new Date(
                                year,
                                selectedMonth,
                                day
                              );
                              setFormData({
                                ...formData,
                                birthdate: newDate,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  language === "VI" ? "Tháng" : "Month"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = i + 1;
                                const monthNames =
                                  language === "VI"
                                    ? [
                                        "Tháng 1",
                                        "Tháng 2",
                                        "Tháng 3",
                                        "Tháng 4",
                                        "Tháng 5",
                                        "Tháng 6",
                                        "Tháng 7",
                                        "Tháng 8",
                                        "Tháng 9",
                                        "Tháng 10",
                                        "Tháng 11",
                                        "Tháng 12",
                                      ]
                                    : [
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December",
                                      ];
                                return (
                                  <SelectItem
                                    key={month}
                                    value={month.toString().padStart(2, "0")}
                                  >
                                    {monthNames[i]}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {/* Day Select */}
                          <Select
                            value={
                              formData.birthdate
                                ? formData.birthdate.getDate().toString()
                                : ""
                            }
                            onValueChange={(day) => {
                              const currentDate = formData.birthdate;
                              if (!currentDate) {
                                // If no date, create one with current year and month
                                const now = new Date();
                                const newDate = new Date(
                                  now.getFullYear(),
                                  now.getMonth(),
                                  parseInt(day)
                                );
                                setFormData({
                                  ...formData,
                                  birthdate: newDate,
                                });
                                return;
                              }
                              const year = currentDate.getFullYear();
                              const month = currentDate.getMonth();
                              const newDate = new Date(
                                year,
                                month,
                                parseInt(day)
                              );
                              setFormData({
                                ...formData,
                                birthdate: newDate,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={language === "VI" ? "Ngày" : "Day"}
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {(() => {
                                // Use current date if no birthdate is set yet
                                const currentDate =
                                  formData.birthdate || new Date();
                                const year = currentDate.getFullYear();
                                const month = currentDate.getMonth();
                                const daysInMonth = new Date(
                                  year,
                                  month + 1,
                                  0
                                ).getDate();
                                return Array.from(
                                  { length: daysInMonth },
                                  (_, i) => {
                                    const day = i + 1;
                                    return (
                                      <SelectItem
                                        key={day}
                                        value={day.toString()}
                                      >
                                        {day}
                                      </SelectItem>
                                    );
                                  }
                                );
                              })()}
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.birthdate && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {format(formData.birthdate, "PPP")}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>{t(language, "profile_city")}</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder={t(language, "profile_select_city")}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>{t(language, "profile_mobile")}</Label>
                        <Input
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobileNumber: e.target.value,
                            })
                          }
                          placeholder="+84 123 456 789"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSave}>
                          {t(language, "profile_save")}
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          {t(language, "profile_cancel")}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="default">
                      {t(language, "auth_sign_in")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline">
                      {t(language, "auth_sign_up")}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
