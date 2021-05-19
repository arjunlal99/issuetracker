import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

count = CountVectorizer()


new_report = sys.argv[1]
existing_reports = sys.argv[2]
threshold = float(sys.argv[3])

new_file = open(new_report, "r")
existing_file = open(existing_reports,"r")

bag_of_words = new_file.readlines()
bag_of_words.extend(existing_file.readlines())
#fh = open('bagofwords', 'r')

count_matrix = count.fit_transform(bag_of_words)
#print(count_matrix.toarray())
new_file.close()
existing_file.close()
cosine_sim = cosine_similarity(count_matrix, count_matrix)

sim_list = cosine_sim[0][1:]
#print(sim_list)
sim = []
for x in range(len(sim_list)):
    if sim_list[x] > threshold:
        sim.append(x)

index = open("index", "r")

ids = index.readlines()
index.close()

sim_ids = []
for x in sim:
    sim_ids.append(ids[x])
print(sim_ids)



