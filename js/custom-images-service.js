/**
 * Created by samsan on 8/7/17.
 */

angular.module('viewCustom')
    .service('customImagesService',['$filter',function ($filter) {
        var serviceObj={};

        // validate url start with $$U and contain $$D, then return new item list
        serviceObj.extractImageUrl=function (item, recordLinks) {
            var itemList=[];
            if(item.pnx.links) {
                var lln02=item.pnx.links.lln02;
                var k=0;
                if(lln02) {
                    for (var i = 0; i < lln02.length; i++) {
                        var patternUrl = /^(\$\$U)/;
                        var patternWord = /(\$\$D)/;
                        var url = lln02[i];
                        if (patternUrl.test(url) && patternWord.test(url)) {
                            var newStr = url.split(' ');
                            newStr = newStr[0];
                            var newUrl = newStr.substring(3, newStr.length);

                            for (var j = 0; j < recordLinks.length; j++) {
                                var record = recordLinks[j];
                                var linkURL = record.linkURL;
                                if (linkURL) {
                                    linkURL = linkURL.trim(' ');
                                    newUrl = newUrl.trim(' ');
                                    if (newUrl === linkURL) {
                                        // replace old url with word EBKPLL with EBKPLT
                                        linkURL = linkURL.replace(/(EBKPLL)/, 'EBKPLT');
                                        record.linkNewURL = linkURL + '?width=155&height=205';
                                        itemList[k] = record;
                                        k++;
                                        j = recordLinks.length;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return itemList;
        };

        // remove json object from json array
        serviceObj.removeMatchItems=function (arrayList, targetList) {
            var itemsList=[];
            if(arrayList.length > 0 && targetList.length > 0) {
                for (var i = 0; i < arrayList.length; i++) {
                    var arr=arrayList[i];
                    var flag=true;
                    // find item that match
                    for(var k=0; k < targetList.length; k++) {
                        var target=targetList[k];
                        if(arr['@id']===target['@id']) {
                            flag=false;
                            k=targetList.length;
                        }
                    }
                    // push item into list if it is not match
                    if(flag) {
                        itemsList.push(arr);
                    }
                }
            }
            return itemsList;
        };

        return serviceObj;
    }]);

