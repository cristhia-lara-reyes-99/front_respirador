import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { InfoIcon, X } from 'lucide-react';

function Ref({ id, name, description, longDescription, onComplete }: RefProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showTimeQuestion, setShowTimeQuestion] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShowTimeQuestion(false);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowTimeQuestion(true);
  };

  const handleTimeSelection = (time: 'less_than_5_min' | '10_min' | 'more_than_10_min') => {
    let cycles;
    switch (time) {
      case 'less_than_5_min':
        cycles = 1;
        break;
      case '10_min':
        cycles = 2;
        break;
      case 'more_than_10_min':
        cycles = 3;
        break;
    }
    onComplete(cycles);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* ... existing code ... */}
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-4 w-4 p-0">
            <InfoIcon className="h-4 w-4" />
            <span className="sr-only">{t('info')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            {!showTimeQuestion ? (
              <>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none"><>{name}</></h4>
                  <p className="text-sm text-muted-foreground">
                    <>{t(longDescription || description)}</>
                  </p>
                </div>
                {/* Add your questionnaire content here */}
                <Button onClick={handleQuestionnaireComplete}>{t('complete_questionnaire')}</Button>
              </>
            ) : (
              <div className="space-y-2">
                <h5 className="font-medium leading-none"><>{t('time_question')}</></h5>
                <p className="text-sm text-muted-foreground">
                  <>{t('time_question_description')}</>
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => handleTimeSelection('less_than_5_min')}><>{t('less_than_5_min')}</></Button>
                  <Button onClick={() => handleTimeSelection('10_min')}><>{t('10_min')}</></Button>
                  <Button onClick={() => handleTimeSelection('more_than_10_min')}><>{t('more_than_10_min')}</></Button>
                </div>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            className="absolute top-2 right-2 h-4 w-4 p-0" 
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}