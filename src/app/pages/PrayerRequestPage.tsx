import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useShrineData } from '../context/ShrineDataContext';
import { useLanguage } from '../context/LanguageContext';
import { Send, CheckCircle, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { createPrayer } from '../../api/prayerApi';

export const PrayerRequestPage: React.FC = () => {
  const { addPrayerRequest } = useShrineData();
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    prayer: '',
  });

  // Tamil font size classes
  const getTamilClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-text` : baseClass;
  };

  const getTamilHeadingClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-heading` : baseClass;
  };

  const getTamilButtonClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-button` : baseClass;
  };

  useEffect(() => {
    // Trigger animations on mount with staggered delays
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.prayer) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    await createPrayer(formData);

    toast.success("Prayer request submitted successfully!");
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      prayer: "",
    });
  } catch (error) {
    toast.error("Failed to submit prayer. Please try again.");
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Card className="max-w-md w-full border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-700" />
              <Sparkles className="w-6 h-6 text-green-500 absolute animate-ping" />
            </div>
            <div className="success-text">
              <h2 className={getTamilHeadingClass("text-2xl font-bold text-green-800 mb-4")}>{t('prayer.request.received.title')}</h2>
              <p className={getTamilClass("text-gray-700 mb-6")}>
                {t('prayer.request.received.message')}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-6 success-details border border-green-100">
              <p className={getTamilClass("text-sm text-gray-700 italic mb-2")}>
                {t('prayer.request.received.scripture')}
              </p>
              <p className={getTamilClass("text-xs text-gray-500 mt-3")}>
                {t('prayer.request.received.note')}
              </p>
            </div>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', prayer: '' });
              }}
              className={getTamilButtonClass("bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 success-button transform hover:scale-105 transition-all duration-200")}
            >
              <Heart className="mr-2 w-5 h-5" />
              {t('prayer.request.submit.another')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Heart className={`w-10 h-10 text-green-700 ${isVisible ? 'animate-heartBeat' : ''}`} />
              <div className="floating-hearts">
                <Heart className="w-4 h-4 text-green-400 floating-heart" style={{animationDelay: '0s'}} />
                <Heart className="w-3 h-3 text-green-500 floating-heart" style={{animationDelay: '1s'}} />
                <Heart className="w-4 h-4 text-green-600 floating-heart" style={{animationDelay: '2s'}} />
              </div>
            </div>
            <h1 className={getTamilHeadingClass("text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent")}>
              {t('prayer.request.title')}
            </h1>
            <Sparkles className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <p className={getTamilClass("text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed")}>
            {t('prayer.request.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Animated Form */}
          <div className="md:col-span-2">
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className={getTamilHeadingClass("text-green-800 flex items-center gap-2")}>
                  <Send className="w-6 h-6" />
                  {t('prayer.request.submit.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Animated Form Fields */}
                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>
                    <Label htmlFor="name" className={getTamilClass("text-green-800 font-medium")}>
                      {t('prayer.request.name')} <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('prayer.request.name')}
                      required
                      className="border-green-200 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-4' : 'opacity-0'}`}>
                    <Label htmlFor="email" className={getTamilClass("text-green-800 font-medium")}>{t('prayer.request.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('prayer.request.email.placeholder')}
                      className="border-green-200 focus:border-green-500 transition-colors"
                    />
                    <p className={getTamilClass("text-xs text-gray-500 mt-1")}>
                      {t('prayer.request.email.note')}
                    </p>
                  </div>

                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-5' : 'opacity-0'}`}>
                    <Label htmlFor="prayer" className={getTamilClass("text-green-800 font-medium")}>
                      {t('prayer.request.intention')} <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                      id="prayer"
                      name="prayer"
                      value={formData.prayer}
                      onChange={handleChange}
                      placeholder={t('prayer.request.intention.placeholder')}
                      rows={6}
                      required
                      className="border-green-200 focus:border-green-500 transition-colors"
                    />
                    <p className={getTamilClass("text-xs text-gray-500 mt-1")}>
                      {t('prayer.request.intention.note')}
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className={getTamilButtonClass("w-full h-12 text-sm font-semibold bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 animate-fadeInUp")}
                  >
                    <Send className="mr-2 w-5 h-5 animate-heartBeat" />
                    {t('prayer.request.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Animated Info Sidebar */}
          <div className="space-y-6">
            {/* Prayer Times */}
            <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 card-hover ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-green-700" />
                  <h4 className={getTamilHeadingClass("text-green-800 font-semibold text-lg")}>{t('prayer.request.daily.times')}</h4>
                </div>
                <p className={getTamilClass("text-sm text-gray-700 mb-3")}>
                  {t('prayer.request.daily.times.subtitle')}
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className={`flex justify-between border-l-4 border-green-300 pl-4 py-2 rounded-r-lg bg-green-50/50 hover:bg-green-50 transition-colors ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
                    <span className={getTamilClass()}>{t('prayer.request.morning.mass')}</span>
                    <span>{t('prayer.request.morning.6am')}</span>
                  </div>
                  <div className={`flex justify-between border-l-4 border-green-300 pl-4 py-2 rounded-r-lg bg-green-50/50 hover:bg-green-50 transition-colors ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{animationDelay: '0.9s'}}>
                    <span className={getTamilClass()}>{t('prayer.request.morning.mass')}</span>
                    <span>{t('prayer.request.morning.9am')}</span>
                  </div>
                  <div className={`flex justify-between border-l-4 border-green-300 pl-4 py-2 rounded-r-lg bg-green-50/50 hover:bg-green-50 transition-colors ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{animationDelay: '1.0s'}}>
                    <span className={getTamilClass()}>{t('prayer.request.evening.mass')}</span>
                    <span>{t('prayer.request.evening.6pm')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prayer to Saint Devasahayam */}
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInRight stagger-4' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={getTamilHeadingClass("text-green-800 mb-3 font-semibold flex items-center gap-2")}>
                  <Sparkles className="w-5 h-5" />
                  {t('prayer.request.saint.prayer.title')}
                </h4>
                <div className="text-sm text-gray-700 space-y-3">
                  <p className={getTamilClass("italic")}>
                    {t('prayer.request.saint.prayer.1')}
                  </p>
                  <p className={getTamilClass("italic")}>
                    {t('prayer.request.saint.prayer.2')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scripture */}
            <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 card-hover ${isVisible ? 'animate-slideInRight stagger-5' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={getTamilHeadingClass("text-green-800 mb-3 font-semibold flex items-center gap-2")}>
                  <Sparkles className="w-5 h-5" />
                  {t('prayer.request.gods.promise')}
                </h4>
                <p className={getTamilClass("text-sm text-gray-700 italic leading-relaxed")}>
                  {t('prayer.request.scripture')}
                </p>
                <p className={getTamilClass("text-xs text-gray-600 mt-2 text-right")}>{t('prayer.request.scripture.reference')}</p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInRight stagger-6' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={getTamilHeadingClass("text-green-800 mb-3 font-semibold")}>{t('prayer.request.need.talk')}</h4>
                <p className={getTamilClass("text-sm text-gray-700 mb-3 leading-relaxed")}>
                  {t('prayer.request.contact.text')}
                </p>
                <p className="text-lg font-semibold text-green-700 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {t('prayer.request.phone')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
