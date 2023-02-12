'use strict';

var _chai = require('chai');

var _mochaSteps = require('mocha-steps');

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _builder = require('../builder');

var _builder2 = _interopRequireDefault(_builder);

var _GuestLobbyPage = require('../pages/GuestLobbyPage');

var _GuestLobbyPage2 = _interopRequireDefault(_GuestLobbyPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('End-to-end Test', function () {
    var page1 = void 0;
    var lobbyPage1 = void 0;
    var page2 = void 0;
    var lobbyPage2 = void 0;

    before(async function () {
        page1 = await _builder2.default.build('Desktop');
        page2 = await _builder2.default.build('Desktop');

        lobbyPage1 = await new _GuestLobbyPage2.default(page1);
        lobbyPage2 = await new _GuestLobbyPage2.default(page2);
    });

    after(async function () {
        // await page.close()
    });

    (0, _mochaSteps.step)('should load lobby page', async function () {
        await page1.goto(_constants2.default.API.BASE_URL + _constants2.default.API.LOBBY_LINK);
        var lobbyMessage = await page1.isElementVisible(_constants2.default.CSS_SELECTORS.LOBBY_PAGE.LOBBY_MESSAGE_CLASS);
        (0, _chai.expect)(lobbyMessage).to.be.true;
    });

    (0, _mochaSteps.step)('should do guest setup and join meeting page', async function () {
        await lobbyPage1.guestSetup();
        var meeting = await page1.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.EDITOR_VIEW_ID);
        (0, _chai.expect)(meeting).to.be.true;
    });

    (0, _mochaSteps.step)('avatar should be visible', async function () {
        var avatar = await page1.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_CLASS);
        (0, _chai.expect)(avatar).to.be.true;
    });

    (0, _mochaSteps.step)('draggable avatar should be visible', async function () {
        var avatar = await page1.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        (0, _chai.expect)(avatar).to.be.true;
    });

    (0, _mochaSteps.step)('avatar should be dragged', async function () {
        var positionBeforeDragged = await page1.getPositionBySelector(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        await page1.drag(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        var postionAfterDragged = await page1.getPositionBySelector(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        (0, _chai.expect)(positionBeforeDragged).to.not.equal(postionAfterDragged);
    });

    (0, _mochaSteps.step)('create secode page instance', async function () {
        await page2.goto(_constants2.default.API.BASE_URL + _constants2.default.API.LOBBY_LINK);
        var lobbyMessage = await page2.isElementVisible(_constants2.default.CSS_SELECTORS.LOBBY_PAGE.LOBBY_MESSAGE_CLASS);
        (0, _chai.expect)(lobbyMessage).to.be.true;
    });

    (0, _mochaSteps.step)('second page instance should do guest setup and join meeting page', async function () {
        await lobbyPage2.guestSetup();
        var meeting = await page2.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.EDITOR_VIEW_ID);
        (0, _chai.expect)(meeting).to.be.true;
    });

    (0, _mochaSteps.step)('second page avatar should be visible', async function () {
        var avatar = await page2.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_CLASS);
        (0, _chai.expect)(avatar).to.be.true;
    });

    (0, _mochaSteps.step)('second page draggable avatar should be visible', async function () {
        var avatar = await page2.isElementVisible(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        (0, _chai.expect)(avatar).to.be.true;
    });

    (0, _mochaSteps.step)('second page avatar should be dragged', async function () {
        var positionBeforeDragged = await page2.getPositionBySelector(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        await page2.drag(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        await page2.drag(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 400, "top");
        await page2.drag(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS, 300, "right");
        var postionAfterDragged = await page2.getPositionBySelector(_constants2.default.CSS_SELECTORS.MEETING_PAGE.AVATAR_DRAGGABLE_CLASS);
        (0, _chai.expect)(positionBeforeDragged).to.not.equal(postionAfterDragged);
    });

    (0, _mochaSteps.step)('changes in second instance architect mode should reflect in first instance', async function () {
        var src = _constants2.default.MEETING_ITEM_IMAGE_SRC.GREEN_PLANT;

        var beforeChangePositionInPage1 = await page1.getPositionByTagWithAttrValue("canvas", "src", src);

        await page2.clickButtonContainingText("build");
        await page2.clickTagWithAttrValue("span", "title", "Image");
        await page2.keyboard.press('L'); // unlock positions in architect mode


        await page2.drag(_constants2.default.CSS_SELECTORS.MEETING_PAGE.SELECTED_ITEM_CLASS, 100, "top");
        await page2.mouse.up();

        await page2.keyboard.press('Escape');
        await page2.keyboard.press('Escape');
        await page2.keyboard.press('a');
        var afterChangePositionInPage1 = await page1.getPositionByTagWithAttrValue("canvas", "src", src);
        (0, _chai.expect)(beforeChangePositionInPage1).to.not.equal(afterChangePositionInPage1);
    });
});