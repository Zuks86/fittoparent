class FitToParent {
    constructor(elem, maxWidthPerc = 100, maxHeightPerc = 100, group = null, tAlign = "left", fontFamily = "'Roboto Condensed', sans-serif",autoResize = true) {
        const me = this;
        me.elem = elem;
        $(me.elem).addClass("fit_to_parent");
        me.parent = $(elem).parent().length > 0 ? $(elem).parent() : null;
        me.maxWidthPerc = maxWidthPerc ? maxWidthPerc : 98;
        me.maxHeightPerc = maxHeightPerc ? maxHeightPerc : 98;
        me.fitParentGroup = group;
        me.tAlign = tAlign;
        me.fontFamily = fontFamily;
        me.autoResize = autoResize;

        $(me.elem)
            .css("word-break","break-word")
            .css("font-family", fontFamily);

        var acceptablePositions = ["relative","absolute","fixed"];
        if(acceptablePositions.indexOf($(me.parent).css("position")) < 0) {
            $(me.parent).css("position", "relative");
        }

        if(me.fitParentGroup != null) {
            $(me.elem).attr("data-fitparent_group",me.fitParentGroup).addClass("fitparent_group");
            if( !(me.fitParentGroup in FitToParent.groups) ) {
                FitToParent.groups[me.fitParentGroup] = -1;
            }
        }

        me.testChar = $("<span>.</span>").addClass("test_char");
        $(me.elem).append(me.testChar);

        this.initialize();

        FitToParent.texts.push(me);

        this.doResize();
    }

    initialize() {
        FitToParent.addResizeListener();
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
        this.doResize();
    }

    doResize(internalTrigger = false) {
        var me = this;

        if(!internalTrigger || me.autoResize) {
            var $elem = $(this.elem);
            if($elem.exists()) {
                $elem.css("font-family", me.fontFamily);

                if($elem.is(":visible")) {

                    me.elem.find("sub").hide();

                    const $parent = $(this.parent);
                    const $testChar = $(this.testChar);
                    $elem.css("width", this.maxWidthPerc+"%");
                    $elem.css("font-size","");
                    $elem.css("text-align",me.tAlign);

                    let fontSize = parseFloat($elem.css("font-size"));
                    let count = 0;

                    if(!$elem.find(".test_char").exists()) {
                        $elem.append(this.testChar);
                    }

                    let increment = 10;
                    //console.log("parent:",$parent.height(),"elem:",$elem.height(),"test:",$testChar.height(),"max:",($parent.height()*(this.maxHeightPerc/100)));
                    while( (this.test1($elem, $parent, $testChar) && count < 1000) && fontSize > 0 ) {
                        fontSize = parseFloat($elem.css("font-size"));
                        fontSize -= increment;
                        if(fontSize > 0) {
                            $elem.css("font-size",fontSize+"px");
                        } else {
                            fontSize += increment;
                            increment /= 10;
                        }
                        count++;
                    }
                    //console.log("parent:",$parent.height(),"elem:",$elem.height(),"test:",$testChar.height());
                    count = 0;
                    increment = 10;
                    while( this.test2($elem, $parent, $testChar) && count < 1000) {
                        fontSize = parseFloat($elem.css("font-size"));
                        fontSize += increment;
                        $elem.css("font-size",fontSize+"px");
                        count++;

                        if(!this.test2($elem, $parent, $testChar) && increment > 0.1) {
                            fontSize -= increment;
                            $elem.css("font-size",fontSize+"px");
                            increment /= 10;
                        }
                    }
                    fontSize = parseFloat($elem.css("font-size"));
                    fontSize = fontSize - 0.1;
                    $elem.css("font-size",fontSize+"px");
                    //console.log("parent:",$parent.height(),"elem:",$elem.height(),"test:",$testChar.height());

                    me.elem.find("sub").show();

                    return fontSize;
                }
            }
            return -1;
        }
    }

    test1($elem, $parent, $testChar) {
        return ($elem.height() > $testChar.height() || $elem.height() > ($parent.height()*(this.maxHeightPerc/100)));
    }

    test2($elem, $parent, $testChar) {
        return ($elem.height() <= $testChar.height() && $elem.height() <= ($parent.height()*(this.maxHeightPerc/100)));
    }

    static addResizeListener() {
        if(!FitToParent.onResizedInitialized) {
            FitToParent.onResizedInitialized = true;
            $(window).on("resize", function() {
                console.log('do fit resize');
                FitToParent.resizeAll(true);
            });
        }
    }

    static resizeAll(internalTrigger = false) {
        FitToParent.resetGroupFontSizes();
        for(var i=0;i<FitToParent.texts.length;i++) {
            var thisFitToParent = FitToParent.texts[i];
            if($(thisFitToParent.elem).is(":visible")) {
                var thisFitToParentGroup = thisFitToParent.fitParentGroup;
                var newFontSize = thisFitToParent.doResize(internalTrigger);

                if(thisFitToParentGroup != null) {
                    if(FitToParent.groups[thisFitToParentGroup] === -1 || FitToParent.groups[thisFitToParentGroup] > newFontSize) {
                        FitToParent.groups[thisFitToParentGroup] = newFontSize;
                    }
                }
            }
        }

        $(".fitparent_group:visible").each(function() {
            var groupFontSize = parseFloat(FitToParent.groups[$(this).attr("data-fitparent_group")]);
            $(this).css("font-size",groupFontSize+"px");
        });
    }

    static resizeGroup(group) {
        FitToParent.groups[group] = -1;
        const fTPs = FitToParent.texts.filter(function(fTP) {
            return fTP.fitParentGroup == group;
        });
        for(var i=0;i<fTPs.length;i++) {
            var thisFitToParent = fTPs[i];
            if($(thisFitToParent.elem).is(":visible")) {
                var thisFitToParentGroup = thisFitToParent.fitParentGroup;
                var newFontSize = thisFitToParent.doResize();

                if(thisFitToParentGroup != null) {
                    if(FitToParent.groups[thisFitToParentGroup] === -1 || FitToParent.groups[thisFitToParentGroup] > newFontSize) {
                        FitToParent.groups[thisFitToParentGroup] = newFontSize;
                    }
                }
            }
        }

        $(".fitparent_group[data-fitparent_group='" + group + "']:visible").each(function() {
            var groupFontSize = parseFloat(FitToParent.groups[$(this).attr("data-fitparent_group")]);
            $(this).css("font-size",groupFontSize+"px");
        });
    }

    static resetGroupFontSizes() {
        var keys = Object.keys(FitToParent.groups);
        for(var i=0;i<keys.length;i++) {
            FitToParent.groups[keys[i]] = -1;
        }
    }

    static deleteGroup(group) {
        FitToParent.texts = FitToParent.texts.filter(function(fTP) {
            return fTP.fitParentGroup != group;
        });
    }

    static deleteAll() {
        FitToParent.texts.splice(0, FitToParent.texts.length);
    }
}

FitToParent.texts = [];
FitToParent.groups = {};
FitToParent.onResizedInitialized = false;