import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import CanonicalErrorBanner from '../../components/advertiser/CanonicalErrorBanner';
import { useAdvertiser } from '../../context/AdvertiserContext';

// 5 Dedicated Upload Screen Components
import ReelVideoUpload from '../../components/advertiser/upload/ReelVideoUpload';
import ReelGridUpload from '../../components/advertiser/upload/ReelGridUpload';
import ReelCarouselUpload from '../../components/advertiser/upload/ReelCarouselUpload';
import FeedCardUpload from '../../components/advertiser/upload/FeedCardUpload';
import SponsoredCardUpload from '../../components/advertiser/upload/SponsoredCardUpload';

export default function AdvertiserCreativeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();

  const format = draftCampaign.format || 'video_ad';
  const goal = draftCampaign.goal || 'reach';

  // State
  const [headline, setHeadline] = useState(
    draftCampaign.headline || (draftCampaign.businessName ? `${draftCampaign.businessName} - विशेष ऑफ़र उपलब्ध!` : '')
  );
  const [description, setDescription] = useState(
    draftCampaign.description || 'उच्च गुणवत्ता और बेहतरीन सेवा, आज ही संपर्क करें या हमारी दुकान पर पधारें।'
  );
  const [ctaText, setCtaText] = useState(draftCampaign.ctaText || 'अधिक जानें');
  const [destinationUrl, setDestinationUrl] = useState(
    draftCampaign.destinationUrl || (draftCampaign.phone || '9826012345')
  );
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(draftCampaign.uploadedCreativeUrl || null);
  const [fileName, setFileName] = useState(draftCampaign.creativeFileName || '');
  const [fileSize, setFileSize] = useState(draftCampaign.creativeFileSize || '');
  const [aspectRatioError, setAspectRatioError] = useState('');
  const [sponsorTag, setSponsorTag] = useState(draftCampaign.sponsorTag || 'प्रायोजित');

  // 2x2 Grid images
  const [gridImages, setGridImages] = useState(
    draftCampaign.gridImages && draftCampaign.gridImages.length === 4
      ? draftCampaign.gridImages
      : ['', '', '', '']
  );

  // Carousel images
  const [carouselImages, setCarouselImages] = useState(
    draftCampaign.carouselImages && draftCampaign.carouselImages.length >= 2
      ? draftCampaign.carouselImages
      : ['', '', '']
  );

  const handleProceed = (e) => {
    e?.preventDefault();

    if (!headline.trim()) {
      setAspectRatioError('कृपया अपने विज्ञापन के लिए एक मुख्य हेडलाइन दर्ज करें।');
      return;
    }

    // Format-specific media validation
    if (format === 'video_ad' && !uploadedMediaUrl) {
      setAspectRatioError('कृपया रील विज्ञापन के लिए वीडियो या वर्टिकल फ़ाइल अपलोड करें।');
      return;
    }

    if (format === 'grid_ad') {
      const uploadedGrid = gridImages.filter(Boolean);
      if (uploadedGrid.length < 2) {
        setAspectRatioError('कृपया ग्रिड विज्ञापन के लिए कम से कम 2 तस्वीरें अपलोड करें।');
        return;
      }
    }

    if (format === 'carousel_ad') {
      const uploadedSlides = carouselImages.filter(Boolean);
      if (uploadedSlides.length < 2) {
        setAspectRatioError('कृपया कैरौसेल विज्ञापन के लिए कम से कम 2 कार्ड स्लाइड्स अपलोड करें।');
        return;
      }
    }

    if (format === 'feed_card_ad' && !uploadedMediaUrl) {
      setAspectRatioError('कृपया फ़ीड कार्ड विज्ञापन के लिए बैनर तस्वीर अपलोड करें।');
      return;
    }

    if (format === 'sponsored_ad' && !uploadedMediaUrl) {
      setAspectRatioError('कृपया स्पॉन्सर्ड कार्ड विज्ञापन के लिए स्टोरी तस्वीर अपलोड करें।');
      return;
    }

    setAspectRatioError('');

    updateDraftCampaign({
      headline: headline.trim(),
      description: description.trim(),
      ctaText,
      destinationUrl: destinationUrl.trim(),
      uploadedCreativeUrl: uploadedMediaUrl,
      creativeFileName: fileName,
      creativeFileSize: fileSize,
      gridImages,
      carouselImages,
      sponsorTag,
    });

    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/budget');
    }
  };

  const renderUploadComponent = () => {
    switch (format) {
      case 'video_ad':
        return (
          <ReelVideoUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            uploadedMediaUrl={uploadedMediaUrl}
            setUploadedMediaUrl={setUploadedMediaUrl}
            fileName={fileName}
            setFileName={setFileName}
            fileSize={fileSize}
            setFileSize={setFileSize}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
          />
        );

      case 'grid_ad':
        return (
          <ReelGridUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            gridImages={gridImages}
            setGridImages={setGridImages}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
          />
        );

      case 'carousel_ad':
        return (
          <ReelCarouselUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            carouselImages={carouselImages}
            setCarouselImages={setCarouselImages}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
          />
        );

      case 'feed_card_ad':
        return (
          <FeedCardUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            uploadedMediaUrl={uploadedMediaUrl}
            setUploadedMediaUrl={setUploadedMediaUrl}
            fileName={fileName}
            setFileName={setFileName}
            fileSize={fileSize}
            setFileSize={setFileSize}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
          />
        );

      case 'sponsored_ad':
        return (
          <SponsoredCardUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            uploadedMediaUrl={uploadedMediaUrl}
            setUploadedMediaUrl={setUploadedMediaUrl}
            fileName={fileName}
            setFileName={setFileName}
            fileSize={fileSize}
            setFileSize={setFileSize}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
            sponsorTag={sponsorTag}
            setSponsorTag={setSponsorTag}
          />
        );

      default:
        return (
          <ReelVideoUpload
            headline={headline}
            setHeadline={setHeadline}
            description={description}
            setDescription={setDescription}
            ctaText={ctaText}
            setCtaText={setCtaText}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            uploadedMediaUrl={uploadedMediaUrl}
            setUploadedMediaUrl={setUploadedMediaUrl}
            fileName={fileName}
            setFileName={setFileName}
            fileSize={fileSize}
            setFileSize={setFileSize}
            aspectRatioError={aspectRatioError}
            setAspectRatioError={setAspectRatioError}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      {/* Brand Header with Step 5/7 */}
      <AdvertiserHeader
        variant="brand"
        step="5"
        totalSteps="7"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/audience');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-3">
          {/* Header Title */}
          <div className="text-center">
            <h2 className="text-[20px] font-bold text-[#2B2437] leading-tight">
              फोटो / वीडियो और विवरण जोड़ें
            </h2>
            <p className="text-[13px] text-[#6B7280] font-normal mt-1 leading-tight">
              विज्ञापन की फोटो/वीडियो, हेडलाइन और बटन सेट करें
            </p>
          </div>

          {/* Canonical Error Banner */}
          {aspectRatioError && (
            <CanonicalErrorBanner message={aspectRatioError} />
          )}

          {/* Dedicated Upload View */}
          {renderUploadComponent()}
        </div>

        {/* Action CTA */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>
    </div>
  );
}
