import sys
from rake_nltk import Rake
r = Rake()
temp = open(sys.argv[1], 'r')

fh = open(sys.argv[2], 'w')


while True:
    
    report = temp.readline()
    if report == "":
        temp.close()
        fh.close()
        break
   # print(report)
    r.extract_keywords_from_text(report)
    bag_of_words = ' '.join(r.get_ranked_phrases())
    fh.write(bag_of_words)
    fh.write('\n')
    
    
        #print(bag_of_words)
        #fh.writelines(bag_of_words)
print("Done")
