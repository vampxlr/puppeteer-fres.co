import { expect } from 'chai';
import { step } from 'mocha-steps';
import  CONSTANTS  from '../constants';
import Page from '../builder';

import GuestLobbyPage from '../pages/GuestLobbyPage';

describe('End-to-end Test', () => {
    let page1;
    let lobbyPage1;
    let page2;
    let lobbyPage2;

    before(async () => {
        page1 = await Page.build('Desktop');
        page2 = await Page.build('Desktop');

        lobbyPage1 = await new GuestLobbyPage(page1);
        lobbyPage2 = await new GuestLobbyPage(page2);
    })

    after(async () => {
        // await page.close()
    })

    step('should load lobby page', async () => {
        await page1.goto(CONSTANTS.API.BASE_URL + CONSTANTS.API.LOBBY_LINK);
        const lobbyMessage = await page1.isElementVisible(CONSTANTS.CSS_SELECTORS.LOBBY_PAGE.LOBBY_MESSAGE_CLASS);
        expect(lobbyMessage).to.be.true;
    })

    step('should do guest setup and join meeting page', async () => {
        await lobbyPage1.guestSetup()
        const meeting = await page1.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.EDITOR_VIEW_ID);
        expect(meeting).to.be.true;
    })


    step('avatar should be visible', async () => {
        const avatar = await page1.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_CLASS);
        expect(avatar).to.be.true;
    })

    step('draggable avatar should be visible', async () => {
        const avatar = await page1.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        expect(avatar).to.be.true;
    })

    step('avatar should be dragged', async () => {
        const positionBeforeDragged = await page1.getPositionBySelector(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        await page1.drag(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        const postionAfterDragged = await page1.getPositionBySelector(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        expect(positionBeforeDragged).to.not.equal(postionAfterDragged)
    })

    step('create secode page instance', async () => {
        await page2.goto(CONSTANTS.API.BASE_URL + CONSTANTS.API.LOBBY_LINK);
        const lobbyMessage = await page2.isElementVisible(CONSTANTS.CSS_SELECTORS.LOBBY_PAGE.LOBBY_MESSAGE_CLASS);
        expect(lobbyMessage).to.be.true;
    })

    step('second page instance should do guest setup and join meeting page', async () => {
        await lobbyPage2.guestSetup();
        const meeting = await page2.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.EDITOR_VIEW_ID);
        expect(meeting).to.be.true;
    })

    step('second page avatar should be visible', async () => {
        const avatar = await page2.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_CLASS);
        expect(avatar).to.be.true;
    })

    step('second page draggable avatar should be visible', async () => {
        const avatar = await page2.isElementVisible(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        expect(avatar).to.be.true;
    })

    step('second page avatar should be dragged', async () => {
        const positionBeforeDragged = await page2.getPositionBySelector(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        await page2.drag(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        await page2.drag(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 400, "top");
        await page2.drag(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        const postionAfterDragged = await page2.getPositionBySelector(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        expect(positionBeforeDragged).to.not.equal(postionAfterDragged)
    })


    step('changes in second instance architect mode should reflect in first instance', async () => {
        const src = CONSTANTS.MEETING_ITEM_IMAGE_SRC.GREEN_PLANT;

        const beforeChangePositionInPage1 = await page1.getPositionByTagWithAttrValue("canvas", "src", src)

        await page2.clickButtonContainingText("build");
        await page2.clickTagWithAttrValue("span", "title", "Image");
        await page2.keyboard.press('L'); // unlock positions in architect mode


        await page2.drag(CONSTANTS.CSS_SELECTORS.MEETING_PAGE.SELECTED_ITEM_CLASS, 100, "top")
        await page2.mouse.up();

        await page2.keyboard.press('Escape');
        await page2.keyboard.press('Escape');
        await page2.keyboard.press('a');
        const afterChangePositionInPage1 = await page1.getPositionByTagWithAttrValue("canvas", "src", src)
        expect(beforeChangePositionInPage1).to.not.equal(afterChangePositionInPage1)

    })

});