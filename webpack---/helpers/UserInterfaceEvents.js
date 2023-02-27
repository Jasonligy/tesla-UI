import AnalyticsHelper from './AnalyticsHelper.js';
import {
    showElement,
    hideElement
} from '../utils/AvayaChatUtils.js';

class UserInterfaceEvents {
    constructor() {
        this.vechicleScreenReferrers = [
            'btn-test-drive',
            'btn-trade-in',
            'btn-inventory',
            'btn-vehicle-place-order',
            'tw-chat--lnk-vehicle-delivery-assistant',
        ];
        this.energyScreenReferrers = ['btn-solar-roof', 'btn-solar-panels', 'btn-energy-place-order'];
        this.buttonLiveAgentId = 'btn-live-agent';
        this.chatLiveFormId = 'chat-page';
        this.history = [];
        this.previousHistoryLength = 0;
    }

    showChatEngagementForm(logEvent = false, analyticsHelper = null) {
        if (logEvent) {
            analyticsHelper.fireEvent(analyticsHelper.formShownInteraction);
        }
        showElement(this.chatLiveFormId);
    }

    handleClickEventsForTopics(event, analyticsHelper, avayaChatConfig) {
        const elemToHide = this.history[this.history.length - 1];

        if (event.target.id !== 'btn-schedule-test-drive') {
            hideElement(elemToHide);
        }

        if (event.target.id === 'btn-account-support') {
            // Show Account Support FAQ
            analyticsHelper.fireEvent(analyticsHelper.chooseTopicInteraction, 'account');
            this.history.push('account-support-faq');
        } else if (event.target.id === 'btn-vehicle-upcoming-delivery') {
            // Show Vehicle Delivery FAQ
            showElement('vehicle-delivery-faq');
            analyticsHelper.fireEvent(analyticsHelper.secondaryTopicInteraction, 'vehicle-delivery-faq');
            this.history.push('vehicle-delivery-faq');
        } else if (event.target.id === 'btn-schedule-test-drive') {
            analyticsHelper.fireEvent(analyticsHelper.secondaryTopicInteraction, 'schedule-test-drive');
            window.location = event.target.href;
        } else if (
            this.vechicleScreenReferrers.includes(event.target.id) ||
            this.energyScreenReferrers.includes(event.target.id) ||
            event.target.id === this.buttonLiveAgentId
        ) {
            const gaTagPostfix = event.target.id.substring(4);
            if (event.target.id === this.buttonLiveAgentId) {
                analyticsHelper.fireEvent(analyticsHelper.chooseTopicInteraction, gaTagPostfix);

                if (
                    avayaChatConfig.autoInitiate &&
                    !avayaChatConfig.isChatLite &&
                    !avayaChatConfig.isWindowMinimized
                ) {
                    const submitButton = document.querySelector(`.tw-chat--avaya-chat__form-button`);
                    submitButton.click();
                }
            } else {
                analyticsHelper.fireEvent(analyticsHelper.secondaryTopicInteraction, gaTagPostfix);
            }

            this.showChatEngagementForm(true, analyticsHelper);
            this.history.push(this.chatLiveFormId);
        } else {
            const analyticsInteractionDetail = 'vehicle';
            const nextScreen = 'topics-vehicle';
            showElement(nextScreen);
            this.history.push(nextScreen);
            analyticsHelper.fireEvent(analyticsHelper.chooseTopicInteraction, analyticsInteractionDetail);
        }
    }

    handleClickEventsForBackButton(event, analyticsHelper) {
        const elemToHide = this.history.pop();
        const elemToShow = this.history[this.history.length - 1];
        hideElement(elemToHide);
        showElement(elemToShow);

        analyticsHelper.fireEvent(analyticsHelper.backInteraction, elemToHide);
    }

    handleUIEvents(analyticsIsOn, AvayaChatConfig) {
        const analyticsHelper = new AnalyticsHelper(true, analyticsIsOn);
        this.resetHistory();

        hideElement('avaya-chat__back-button');
        showElement('main-topics');

        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('tw-chat--avaya-topic--event')) {
                event.preventDefault();
                this.handleClickEventsForTopics(event, analyticsHelper, AvayaChatConfig);
            } else if (event.target.classList.contains('tw-chat--avaya-chat__back-button')) {
                event.preventDefault();
                this.handleClickEventsForBackButton(event, analyticsHelper);
            } else if (event.target.classList.contains('vehicle-delivery-links--lnk-need-assistance')) {
                event.preventDefault();
                hideElement(event.target.parentNode.parentNode.id);
                // Show Chat Lite/Engagement Form
                const elemToHide = this.history[this.history.length - 1];
                hideElement(elemToHide);
                this.history.push(this.chatLiveFormId);
                this.showChatEngagementForm(true, analyticsHelper);
            }

            if (this.previousHistoryLength !== this.history.length) {
                this.updateBackButtonVisibility();
            }
        });
    }

    resetHistory() {
        this.history = ['main-topics'];
        this.previousHistoryLength = this.history.length;
        this.updateBackButtonVisibility();
    }

    updateBackButtonVisibility() {
        if (this.history.length >= 2) {
            showElement('avaya-chat__back-button');
        } else {
            hideElement('avaya-chat__back-button');
        }
        this.previousHistoryLength = this.history.length;
    }
}

export default UserInterfaceEvents;